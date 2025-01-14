import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidV4 } from 'uuid';
import { db, storage, ref, uploadBytesResumable, getDownloadURL } from '../../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { ProgressBar, Toast } from 'react-bootstrap';

const AddFileButton = ({ currentFolder }) => {
  const { currentUser } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (currentFolder === null || file === null) return

    // allows us to create unique ids
    const id = uuidV4();
    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false }
    ]);

    // If we are in the root folder, ignore our currentFolder's name
    // Puts files in the correct order in Firebase Storage
    const filePath = currentFolder === ROOT_FOLDER ? `${currentFolder.path.map(folder => folder.name).join('/')}/${file.name}` : `${currentFolder.path.map(folder => folder.name).join('/')}/${currentFolder.name}/${file.name}`;
    // console.log('🚀 ~ handleUpload ~ filePath:', filePath); // delete later

    // This is where we will save the upload task to
    const storageRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // snapshot runs all the time and tell progress of our upload
    uploadTask.on('state_changed', snapshot => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      setUploadingFiles(prevUploadingFiles => {
        return prevUploadingFiles.map(uploadFile => {
          if (uploadFile.id === id) {
            return { ...uploadFile, progress: progress }
          }
          return uploadFile;
        })
      })
    }, () => {
      // If there's an error in the upload process, it will set the error to true
      setUploadingFiles(prevUploadingFiles => {
        return prevUploadingFiles.map(uploadFile => {
          if (uploadFile.id === id) {
            return { ...uploadFile, error: true }
          }
          return uploadFile;
        })
      })
    }, () => {
      // Removes progress bar once upload is finished
      setUploadingFiles(prevUploadingFiles => {
        return prevUploadingFiles.filter(uploadFile => {
          return uploadFile.id !== id
        });
      });

      // Gets the download url for the file now that the file is uploaded
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          const q = query(
            collection(db, 'files'),
            where('name', '==', file.name),
            where('userID', '==', currentUser.uid),
            where('folderId', '==', currentFolder.id))

          // Adds file to Cloud Firestore
          getDocs(q)
            .then(async (existingFiles) => {
              const existingFile = existingFiles.docs[0]
              if (existingFile) {
                const fileDocRef = doc(db, 'files', existingFile.id);
                await updateDoc(fileDocRef, { url: downloadURL });
              } else {
                try {
                  await addDoc(collection(db, "files"), {
                    name: file.name,
                    url: downloadURL,
                    folderId: currentFolder.id,
                    userID: currentUser.uid,
                    createdAt: serverTimestamp()
                  });
                } catch (err) {
                  console.error(err);
                }
              }
            })
        });
    })
  }
  return (
    <>
      <label className='btn btn-outline-success btn-sm m-0 me-2'>
        <FontAwesomeIcon icon={faFileUpload} />
        <input type='file' onChange={handleUpload} style={{ opacity: 0, position: 'absolute', left: '-9999px' }} />
      </label>
      {uploadingFiles.length > 0 && ReactDOM.createPortal(
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', maxWidth: '250px' }}>
          {uploadingFiles.map(file => (
            <Toast key={file.id} onClose={() => {
              // Close button will clear out errors.
              // If it doesn't equal the current file, then don't remove it
              setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.filter(uploadFile => {
                  return uploadFile.id !== file.id
                })
              })
            }}>
              <Toast.Header className='text-truncate w-100 d-block' closeButton={file.error}>{file.name}</Toast.Header>
              <Toast.Body>
                {/* file.progress will be a decimal between 0-1 */}
                <ProgressBar
                  variant={file.error ? 'danger' : 'primary'}
                  animated={!file.error}
                  now={file.error ? 100 : file.progress * 100}
                  label={file.error ? 'Error' : `${Math.round(file.progress * 100)}%`} />
              </Toast.Body>
            </Toast>
          ))}
        </div>,
        document.body // second param for createPortal. This is where the portal gets rendered out
      )}
    </>
  );
}

export default AddFileButton;
