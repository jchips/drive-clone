import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const Folder = ({ folder }) => {
  return (
    <Button as={Link} to={{ pathname: `/folder/${folder.id}`, pathState: { folder: folder } }} variant='outline-dark' className='text-truncate w-100'>
      <FontAwesomeIcon icon={faFolder} className='mr-2' />
      {folder.name}
    </Button>
  );
}

export default Folder;
