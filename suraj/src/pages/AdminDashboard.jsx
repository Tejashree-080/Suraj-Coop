import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import database from '../firebaseConfig';
import { storage } from '../firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // State for data
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [images, setImages] = useState([]);
  
  // State for form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [fileUpload, setFileUpload] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  
  // Firebase listeners
  useEffect(() => {
    // Fetch announcements
    const announcementsRef = ref(database, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const announcementsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAnnouncements(announcementsList);
      } else {
        setAnnouncements([]);
      }
    });

    // Fetch documents
    const documentsRef = database.ref('documents');
    documentsRef.once("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const documentsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setDocuments(documentsList);
      } else {
        setDocuments([]);
      }
    });

    // Fetch images
    const imagesRef = ref(database, 'images');
    const unsubscribeImages = onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const imagesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setImages(imagesList);
      } else {
        setImages([]);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAnnouncements();
      unsubscribeImages();
    };
  }, []);
  
  // Function to open modal
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    resetForm();
  };
  
  // Reset form values
  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormStatus('Active');
    setFileUpload(null);
    setFileDescription('');
  };
  
  // Add new announcement
  const addAnnouncement = (e) => {
    e.preventDefault();
    const announcementsRef = ref(database, 'announcements');
    const newAnnouncementRef = push(announcementsRef);
    
    set(newAnnouncementRef, {
      title: formTitle,
      content: formContent,
      status: formStatus,
      date: new Date().toISOString().split('T')[0]
    })
    .then(() => {
      setShowModal(false);
      resetForm();
    })
    .catch((error) => {
      console.error("Error adding announcement: ", error);
    });
  };
  
  // Delete announcement
  const deleteAnnouncement = (id) => {
    const announcementRef = ref(database, `announcements/${id}`);
    remove(announcementRef)
      .catch((error) => {
        console.error("Error deleting announcement: ", error);
      });
  };
  
  // Upload document
  const uploadDocument = (e) => {
    e.preventDefault();
    if (!fileUpload) return;
    
    const fileName = fileUpload.name;
    const fileType = fileName.split('.').pop().toUpperCase();
    const fileRef = storageRef(storage, `documents/${fileName}`);
    
    uploadBytes(fileRef, fileUpload)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        const documentsRef = ref(database, 'documents');
        const newDocumentRef = push(documentsRef);
        
        return set(newDocumentRef, {
          name: formTitle || fileName,
          url: downloadURL,
          type: fileType,
          description: fileDescription,
          uploadDate: new Date().toISOString().split('T')[0],
          downloads: 0
        });
      })
      .then(() => {
        setShowModal(false);
        resetForm();
      })
      .catch((error) => {
        console.error("Error uploading document: ", error);
      });
  };
  
  // Delete document
  const deleteDocument = (id, url) => {
    // Delete from storage first
    const fileRef = storageRef(storage, url);
    deleteObject(fileRef)
      .then(() => {
        // Then delete from database
        const documentRef = ref(database, `documents/${id}`);
        return remove(documentRef);
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };
  
  // Upload image
  const uploadImage = (e) => {
    e.preventDefault();
    if (!fileUpload) return;
    
    const fileName = fileUpload.name;
    const fileRef = storageRef(storage, `images/${fileName}`);
    
    uploadBytes(fileRef, fileUpload)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        const imagesRef = ref(database, 'images');
        const newImageRef = push(imagesRef);
        
        return set(newImageRef, {
          name: formTitle || fileName,
          url: downloadURL,
          description: fileDescription,
          uploadDate: new Date().toISOString().split('T')[0],
          views: 0
        });
      })
      .then(() => {
        setShowModal(false);
        resetForm();
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
      });
  };
  
  // Delete image
  const deleteImage = (id, url) => {
    // Delete from storage first
    const fileRef = storageRef(storage, url);
    deleteObject(fileRef)
      .then(() => {
        // Then delete from database
        const imageRef = ref(database, `images/${id}`);
        return remove(imageRef);
      })
      .catch((error) => {
        console.error("Error deleting image: ", error);
      });
  };
  
  // Generic file upload handler
  const handleFileUpload = (e) => {
    if (modalType === 'document') {
      uploadDocument(e);
    } else if (modalType === 'image') {
      uploadImage(e);
    }
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };
  
  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
            <div className="position-sticky pt-3">
              <div className="sidebar-header p-3">
                <h3 className="text-light">Skyline Towers</h3>
              </div>
              <ul className="nav flex-column">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { id: 'announcements', label: 'Announcements', icon: '📢' },
                  { id: 'gallery', label: 'Gallery', icon: '🖼️' },
                  { id: 'documents', label: 'Documents', icon: '📄' },
                  { id: 'users', label: 'Users', icon: '👥' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' },
                ].map((item) => (
                  <li className="nav-item" key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                    >
                      <span className="me-2">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="position-absolute bottom-0 w-100 p-3 text-center text-light">
                <p className="text-muted mb-1">Logged in as</p>
                <p className="mb-3">Admin User</p>
                <button className="btn btn-outline-light w-100">Logout</button>
              </div>
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Admin Dashboard</h1>
                  <div className="btn-toolbar mb-2 mb-md-0">
                    <button 
                      className="btn btn-primary me-2"
                      onClick={() => openModal('announcement')}
                    >
                      <span>📢</span> New Announcement
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => openModal('upload')}
                    >
                      <span>📤</span> Upload Files
                    </button>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="row mb-4">
                  <div className="col-md-4 mb-4">
                    <div className="card bg-primary text-white h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-uppercase">Total Announcements</h6>
                            <h1 className="display-4">{announcements.length}</h1>
                          </div>
                          <div className="text-white fs-1">📢</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="card bg-success text-white h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-uppercase">Total Documents</h6>
                            <h1 className="display-4">{documents.length}</h1>
                          </div>
                          <div className="text-white fs-1">📄</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="card bg-danger text-white h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-uppercase">Total Images</h6>
                            <h1 className="display-4">{images.length}</h1>
                          </div>
                          <div className="text-white fs-1">🖼️</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Recent Announcements</h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          {announcements.slice(0, 3).map(announcement => (
                            <div 
                              key={announcement.id} 
                              className="list-group-item list-group-item-action"
                            >
                              <div className="d-flex w-100 justify-content-between">
                                <h6 className="mb-1">{announcement.title}</h6>
                                <div>
                                  <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteAnnouncement(announcement.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <small className="text-muted">Posted: {announcement.date}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Recent Uploads</h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          {documents.slice(0, 2).map(doc => (
                            <div 
                              key={doc.id} 
                              className="list-group-item list-group-item-action"
                            >
                              <div className="d-flex w-100 justify-content-between">
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-primary me-2">{doc.type}</span>
                                  <h6 className="mb-1">{doc.name}</h6>
                                </div>
                                <button className="btn btn-sm btn-outline-primary">Manage</button>
                              </div>
                              <small className="text-muted">{doc.uploadDate} · {doc.downloads} downloads</small>
                            </div>
                          ))}
                          {images.slice(0, 1).map(img => (
                            <div 
                              key={img.id} 
                              className="list-group-item list-group-item-action"
                            >
                              <div className="d-flex w-100 justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="me-2" style={{ width: '40px', height: '40px', overflow: 'hidden' }}>
                                    <img 
                                      src={img.url || '/api/placeholder/100/100'} 
                                      alt={img.name}
                                      className="img-fluid rounded"
                                    />
                                  </div>
                                  <h6 className="mb-1">{img.name}</h6>
                                </div>
                                <button className="btn btn-sm btn-outline-primary">Manage</button>
                              </div>
                              <small className="text-muted">{img.uploadDate} · {img.views} views</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="announcements-content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Manage Announcements</h1>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal('announcement')}
                  >
                    <span>+</span> New Announcement
                  </button>
                </div>
                
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th>Title</th>
                            <th>Date Posted</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {announcements.map(announcement => (
                            <tr key={announcement.id}>
                              <td>{announcement.title}</td>
                              <td>{announcement.date}</td>
                              <td>
                                <span className="badge bg-success">
                                  {announcement.status}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteAnnouncement(announcement.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="documents-content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Manage Documents</h1>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal('document')}
                  >
                    <span>+</span> Upload Document
                  </button>
                </div>
                
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover mb-0">
                        <thead className="table-dark">
                          <tr>
                            <th>Document Name</th>
                            <th>Type</th>
                            <th>Upload Date</th>
                            <th>Downloads</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map(doc => (
                            <tr key={doc.id}>
                              <td>{doc.name}</td>
                              <td>
                                <span className="badge bg-primary">
                                  {doc.type}
                                </span>
                              </td>
                              <td>{doc.uploadDate}</td>
                              <td>{doc.downloads}</td>
                              <td>
                                <a 
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn btn-sm btn-outline-primary me-1"
                                >
                                  View
                                </a>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteDocument(doc.id, doc.url)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="gallery-content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Manage Gallery</h1>
                  <button 
                    className="btn btn-primary"
                    onClick={() => openModal('image')}
                  >
                    <span>+</span> Upload Images
                  </button>
                </div>
                
                <div className="row">
                  {images.map(img => (
                    <div key={img.id} className="col-md-4 mb-4">
                      <div className="card h-100">
                        <img 
                          src={img.url || '/api/placeholder/400/300'} 
                          className="card-img-top"
                          alt={img.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{img.name}</h5>
                          <p className="card-text text-muted">
                            Uploaded: {img.uploadDate} • {img.views} views
                          </p>
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-sm btn-outline-primary">Edit Info</button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteImage(img.id, img.url)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Modals */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {modalType === 'announcement' && 'Create New Announcement'}
                {modalType === 'document' && 'Upload Document'}
                {modalType === 'image' && 'Upload Image'}
                {modalType === 'upload' && 'Upload Files'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            
            <div className="modal-body">
              {/* Announcement Form */}
              {modalType === 'announcement' && (
                <form onSubmit={addAnnouncement}>
                  <div className="mb-3">
                    <label htmlFor="announcement-title" className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-control"
                      id="announcement-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="announcement-content" className="form-label">Content</label>
                    <textarea 
                      className="form-control"
                      id="announcement-content"
                      rows="6"
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="announcement-status" className="form-label">Status</label>
                    <select 
                      className="form-select"
                      id="announcement-status"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Announcement
                    </button>
                  </div>
                </form>
              )}
              
              {/* Document Upload Form */}
              {modalType === 'document' && (
                <form onSubmit={handleFileUpload}>
                  <div className="mb-3">
                    <label htmlFor="document-title" className="form-label">Document Title</label>
                    <input 
                      type="text" 
                      className="form-control"
                      id="document-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="document-description" className="form-label">Description</label>
                    <textarea 
                      className="form-control"
                      id="document-description"
                      rows="3"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="document-file" className="form-label">Choose File</label>
                    <input 
                      type="file" 
                      className="form-control"
                      id="document-file"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Upload Document
                    </button>
                  </div>
                </form>
              )}
              
              {/* Image Upload Form */}
              {modalType === 'image' && (
                <form onSubmit={handleFileUpload}>
                  <div className="mb-3">
                    <label htmlFor="image-title" className="form-label">Image Title</label>
                    <input 
                      type="text" 
                      className="form-control"
                      id="image-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image-description" className="form-label">Description</label>
                    <textarea 
                      className="form-control"
                      id="image-description"
                      rows="3"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image-file" className="form-label">Choose Image</label>
                    <input 
                      type="file" 
                      className="form-control"
                      id="image-file"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Upload Image
                    </button>
                  </div>
                </form>
              )}
              
              {/* General Upload Form */}
              {modalType === 'upload' && (
                <div>
                  <div className="row text-center">
                    <div className="col-md-6">
                      <div className="p-4 border rounded mb-3">
                        <h3>📄</h3>
                        <h5>Document</h5>
                        <p className="text-muted">Upload PDF, Word, Excel files</p>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => openModal('document')}
                        >
                          Upload Document
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-4 border rounded mb-3">
                        <h3>🖼️</h3>
                        <h5>Image</h5>
                        <p className="text-muted">Upload JPG, PNG, GIF files</p>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => openModal('image')}
                        >
                          Upload Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      {showModal && (
        <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
      )}
    </div>
  );
};

export default AdminDashboard;