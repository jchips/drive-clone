import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { Link } from 'react-router-dom';

const FolderBreadcrumbs = ({ currentFolder }) => {
  // If there's no path, we're in our root folder. 
  // If the current folder is the root, then set path to empty array.
  // Otherwise, start the path at the root.
  // Path is an array of objects.
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]
  
  // If there's a current folder, get the above path and join it with the rest of ther
  // current folder's paths.
  if (currentFolder) path = [...path, ...currentFolder.path]
  return (
    <Breadcrumb className='flex-grow-1' listProps={{ className: 'bg-white ps-0 m-0'}}>
      {path.map((folder, index) => (
        // If there's a folder id, then go to that folder's path. Otherwise, go to root.
        <Breadcrumb.Item 
          className='text-truncate d-inline-block'
          linkAs={Link}
          // Passing state and path info with the route. Passing path info with the folder info
          linkProps={
            {
              to: {
                pathname: folder.id ? `/folder/${folder.id}` : '/',
                pathState: {folder: { ...folder, path: path.slice(1, index) }}
              }
            }
          }
          style={{ maxWidth: '150px'}} 
          key={folder.id}>
          {folder.name}
        </Breadcrumb.Item>
      ))}

      {currentFolder && (
        <Breadcrumb.Item className='text-truncate d-inline-block' style={{ maxWidth: '200px'}} active>
          {currentFolder.name}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}

export default FolderBreadcrumbs;
