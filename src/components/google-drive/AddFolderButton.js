import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';

const AddFolderButton = ({ currentFolder }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { currentUser } = useAuth();

  const openModal = () => {
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If not in a folder at all (not in root or any other folder)
    if (currentFolder === null) return

    const path = [...currentFolder.path];

    // Adds current folder to the path
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id })
    }

    try {
      await addDoc(collection(db, "folders"), {
        name: name,
        parentID: currentFolder.id,
        userID: currentUser.uid,
        path,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }

    setName(''); // clears the form
    closeModal();
  }

  return (
    <>
      <Button variant='outline-success' onClick={openModal} size='sm'>
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control type='text' value={name} onChange={e => setName(e.target.value)} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={closeModal}>Close</Button>
            <Button variant='success' type='submit'>Add Folder</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddFolderButton;
