import { useEffect, useReducer } from "react";
import { db } from "../firebase";
import { doc, getDoc, query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const ACTIONS = {
  SELECT_FOLDER: 'select-folder',
  UPDATE_FOLDER: 'update-folder',
  SET_CHILD_FOLDERS: 'set-child-folders',
  SET_CHILD_FILES: 'set-child-files'
}

export const ROOT_FOLDER = { name: 'Root', id: null, path: [] }

// Returns brand new state object
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFolders: [],
        childFiles: []
      }
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder
      }
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders
      }
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles
      }
    default:
      return state;
  }
}

// Defaults parameters to null instead of undefined
// useReducer takes in a reducer function and an initial state
export function useFolder(folderId = null, folder = null) {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: []
  });

  /**
   * Formats the document object
   * @param {Object} doc - The document in the collection
   * @returns {Object} - Formatted object
   */
  const formatDoc = (doc) => {
    let formattedDoc = {
      id: doc.id,
      ...doc.data()
    }
    console.log('🚀 ~ formatDoc ~ formattedDoc.doc.data():', doc.data()); // delete later
    return formattedDoc;
  }

  /**
   * Dispatch allows us to change things in our state. It dispatches an event over to our
   * reducer above. When any of the parameters change, (things in the array),
   * it resets the useEffect.
   * Runs everytime either the folderId or folder changes.
   */
  useEffect(() => {
    dispatch({
      type: ACTIONS.SELECT_FOLDER,
      payload: { folderId, folder }
    });
  }, [folder, folderId]);

  // Access current folder
  useEffect(() => {
    if (folderId === null) { // in the root folder
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER }
      });
    }

    // If there's an error getting the current folder, update the root instead
    const getFolderId = doc(db, 'folders', folderId);
    getDoc(getFolderId)
      .then(doc => {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: formatDoc(doc) }
        });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER }
        });
      })
  }, [folderId]);

  // Shows the child folders
  useEffect(() => {
    const q = query(
      collection(db, 'folders'),
      where('parentID', '==', folderId),
      where('userID', '==', currentUser.uid),
      orderBy('createdAt'))

    /**
     * Run code every time a new folder is created or a folder is changed or edited,
     * (the parameters in the array change),
     * the onSnapshot will run to tell us what the new set of folders that meet
     * the criteria are.
     * onSnapshot returns a cleanup function.
     **/
    const unsubscribe = onSnapshot(q, (snapshot) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FOLDERS,
        payload: { childFolders: snapshot.docs.map((doc) => formatDoc(doc)) },
      });
    });
    return unsubscribe;
  }, [folderId, currentUser]);

  // Shows the child files
  useEffect(() => {
    const q = query(
      collection(db, 'files'),
      where('folderId', '==', folderId),
      where('userID', '==', currentUser.uid),
      orderBy('createdAt'))

    /**
     * Run code every time a new folder is created or a folder is changed or edited,
     * (the parameters in the array change),
     * the onSnapshot will run to tell us what the new set of folders that meet
     * the criteria are.
     * onSnapshot returns a cleanup function.
     **/
    const unsubscribe = onSnapshot(q, (snapshot) => {
      dispatch({
        type: ACTIONS.SET_CHILD_FILES,
        payload: { childFiles: snapshot.docs.map((doc) => formatDoc(doc)) },
      });
    });
    return unsubscribe;
  }, [folderId, currentUser]);

  return state;
}