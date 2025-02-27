import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const File = ({ file }) => {
  return (
    <a href={file.url} target='_blank' className='btn btn-outline-dark text-truncate w-100' rel="noreferrer">
      <FontAwesomeIcon icon={faFile} className='me-2'/>
      {file.name}
    </a>
  );
}

export default File;
