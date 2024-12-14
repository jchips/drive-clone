import React from 'react';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import AddFolderButton from './AddFolderButton';
import { useFolder } from '../../hooks/useFolder';
import Folder from './Folder';
import File from './File';
import { useParams, useLocation } from 'react-router-dom';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import AddFileButton from './AddFileButton';

const Dashboard = () => {
  const { folderId } = useParams();
  const { pathState = {} } = useLocation();
  // console.log('path state', pathState); // delete later
  const { folder, childFolders, childFiles } = useFolder(folderId, pathState.folder); // state.folder is the data being passed along
  // console.log('🚀 ~ Dashboard ~ folder:', folder);

  return (
    <div>
      <Navbar />
      <Container fluid>
        <div className='d-flex align-items-center'>
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        {childFolders.length > 0 && (
          <div className='d-flex flex-wrap'>
            {childFolders.map(childFolder => (
              <div key={childFolder.id} style={{ maxWidth: '250px' }} className='p-2'>
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && (<hr />)}
        {childFiles.length > 0 && (
          <div className='d-flex flex-wrap'>
            {childFiles.map(childFile => (
              <div key={childFile.id} style={{ maxWidth: '250px' }} className='p-2'>
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
