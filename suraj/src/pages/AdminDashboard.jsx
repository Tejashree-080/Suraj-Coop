import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import database from '../firebaseConfig';
import { storage } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom'; // Added import
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

const customStyles = {
  gradientBg: {
    background: "linear-gradient(135deg, #0C0420, #5D3C64)",
    color: "white"
  },
  headerBg: {
    background: "linear-gradient(135deg, #0C0420, #5D3C64)",
    backdropFilter: "blur(5px)"
  },
  pinkishPurple: {
    color: "#ffffff"
  },
  loginButton: {
    background: "#9F6496",
    transition: "background 0.3s"
  },
  primaryButton: {
    background: "#D391B0",
    transition: "background 0.3s, transform 0.2s",
    border: "none"
  },
  outlineButton: {
    borderColor: "#D391B0",
    color: "white",
    transition: "background 0.3s, transform 0.2s"
  },
  cardBg: {
    background: "#5D3C64"
  },
  footerBg: {
    background: "#5D3C64"
  },
  footerText: {
    color: "#D391B0"
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [images, setImages] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [fileUpload, setFileUpload] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const navigate = useNavigate(); // Added useNavigate hook

  useEffect(() => {
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

    return () => {
      unsubscribeAnnouncements();
      unsubscribeImages();
    };
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormStatus('Active');
    setFileUpload(null);
    setFileDescription('');
  };

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

  const deleteAnnouncement = (id) => {
    const announcementRef = ref(database, `announcements/${id}`);
    remove(announcementRef)
      .catch((error) => {
        console.error("Error deleting announcement: ", error);
      });
  };

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

  const deleteDocument = (id, url) => {
    const fileRef = storageRef(storage, url);
    deleteObject(fileRef)
      .then(() => {
        const documentRef = ref(database, `documents/${id}`);
        return remove(documentRef);
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

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

  const deleteImage = (id, url) => {
    const fileRef = storageRef(storage, url);
    deleteObject(fileRef)
      .then(() => {
        const imageRef = ref(database, `images/${id}`);
        return remove(imageRef);
      })
      .catch((error) => {
        console.error("Error deleting image: ", error);
      });
  };

  const handleFileUpload = (e) => {
    if (modalType === 'document') {
      uploadDocument(e);
    } else if (modalType === 'image') {
      uploadImage(e);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="admin-dashboard" >
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-3 col-lg-2 d-md-block sidebar collapse" style={customStyles.headerBg}>
            <div className="position-sticky pt-3">
              <div className="sidebar-header p-3">
                <h3 style={customStyles.pinkishPurple}>Skyline Towers</h3>
              </div>
              <ul className="nav flex-column">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <svg width="20px" height="20px" viewBox="0 0 24 24" id="meteor-icon-kit__solid-dashboard" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 0H7C8.10457 0 9 0.89543 9 2V7C9 8.10457 8.10457 9 7 9H2C0.89543 9 0 8.10457 0 7V2C0 0.89543 0.89543 0 2 0ZM2 11H7C8.10457 11 9 11.8954 9 13V22C9 23.1046 8.10457 24 7 24H2C0.89543 24 0 23.1046 0 22V13C0 11.8954 0.89543 11 2 11ZM13 0H22C23.1046 0 24 0.89543 24 2V13C24 14.1046 23.1046 15 22 15H13C11.8954 15 11 14.1046 11 13V2C11 0.89543 11.8954 0 13 0ZM13 17H22C23.1046 17 24 17.8954 24 19V22C24 23.1046 23.1046 24 22 24H13C11.8954 24 11 23.1046 11 22V19C11 17.8954 11.8954 17 13 17Z" fill="#D391B0"></path></g></svg> },
                  { id: 'announcements', label: 'Post Announcements', icon: <svg fill="#D391B0" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M959.342 1355.283c4.287.007 20.897.18 45.834 4.517l-3.388 55.341c-1.13 29.365-25.976 53.083-55.34 53.083-65.507 0-110.683 19.2-141.177 57.6-68.895 88.094-45.177 263.153-30.495 324.14 4.518 16.942 0 35.013-10.164 48.566-11.294 13.553-27.106 21.458-44.047 21.458h-212.33c-31.623 0-56.47-24.847-56.47-56.47v-508.235Zm627.82-1324.044c11.633-23.492 37.61-35.576 63.473-29.816 25.525 6.099 43.483 28.8 43.483 55.002V570.42C1822.87 596.623 1920 710.693 1920 847.013c0 136.32-97.13 250.504-225.882 276.706v513.883c0 26.202-17.958 49.016-43.483 55.002a57.279 57.279 0 0 1-12.988 1.468c-21.12 0-40.772-11.746-50.485-31.172C1379.238 1247.164 964.18 1242.307 960 1242.307H395.294c-155.746 0-282.353-126.607-282.353-282.352v-56.471h-56.47C25.299 903.484 0 878.298 0 847.014c0-31.172 25.299-56.471 56.47-56.471h56.471v-56.47c0-155.634 126.607-282.354 282.353-282.354h564.593c16.941-.113 420.48-7.002 627.275-420.48Z" fill-rule="evenodd"></path> </g></svg> },
                  { id: 'gallery', label: 'Gallery', icon: <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447ZM16 10C17.1046 10 18 9.10457 18 8C18 6.89543 17.1046 6 16 6C14.8954 6 14 6.89543 14 8C14 9.10457 14.8954 10 16 10ZM6.32092 13.1038C6.94501 12.5241 7.91991 12.5566 8.50397 13.1766L11.1515 15.9869C11.9509 16.8356 13.2596 16.9499 14.1941 16.2527C14.8073 15.7953 15.661 15.8473 16.2141 16.3757L18.4819 18.5423C18.7814 18.8284 19.2562 18.8176 19.5423 18.5181C19.8284 18.2186 19.8176 17.7438 19.5181 17.4577L17.2503 15.2911C16.1679 14.257 14.4971 14.1553 13.2972 15.0504C12.9735 15.2919 12.5202 15.2523 12.2433 14.9584L9.59579 12.1481C8.44651 10.9281 6.52816 10.8641 5.3001 12.0047L4.4896 12.7575C4.1861 13.0394 4.16858 13.5139 4.45047 13.8174C4.73236 14.1209 5.20691 14.1385 5.51041 13.8566L6.32092 13.1038Z" fill="#D391B0"></path> </g></svg> },
                  { id: 'documents', label: 'Upload Documents', icon: <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214L15.0136 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z" fill="#D391B0"></path> <path d="M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z" fill="#D391B0"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C20.9812 19.6756 20.9997 17.8316 21 14.1801L18.1817 16.9984C17.9119 17.2683 17.691 17.4894 17.4415 17.6841C17.1491 17.9121 16.8328 18.1076 16.4981 18.2671C16.2124 18.4032 15.9159 18.502 15.5538 18.6225L13.2421 19.3931C12.4935 19.6426 11.6682 19.4478 11.1102 18.8898C10.5523 18.3318 10.3574 17.5065 10.607 16.7579L10.8805 15.9375L11.3556 14.5121L11.3775 14.4463C11.4981 14.0842 11.5968 13.7876 11.7329 13.5019C11.8924 13.1672 12.0879 12.8509 12.316 12.5586C12.5106 12.309 12.7317 12.0881 13.0017 11.8183L17.0081 7.81188L18.12 6.70004L18.2472 6.57282C18.9626 5.85741 19.9003 5.49981 20.838 5.5C20.6867 4.46945 20.3941 3.73727 19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157ZM7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H10.5C10.9142 12.25 11.25 12.5858 11.25 13C11.25 13.4142 10.9142 13.75 10.5 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="#D391B0"></path> </g></svg> },
                  { id: 'users', label: 'Manage Users', icon: <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z" fill="#D391B0"></path> <path d="M18 16.5C18 18.433 15.3137 20 12 20C8.68629 20 6 18.433 6 16.5C6 14.567 8.68629 13 12 13C15.3137 13 18 14.567 18 16.5Z" fill="#D391B0"></path> <path d="M7.12205 5C7.29951 5 7.47276 5.01741 7.64005 5.05056C7.23249 5.77446 7 6.61008 7 7.5C7 8.36825 7.22131 9.18482 7.61059 9.89636C7.45245 9.92583 7.28912 9.94126 7.12205 9.94126C5.70763 9.94126 4.56102 8.83512 4.56102 7.47063C4.56102 6.10614 5.70763 5 7.12205 5Z" fill="#D391B0"></path> <path d="M5.44734 18.986C4.87942 18.3071 4.5 17.474 4.5 16.5C4.5 15.5558 4.85657 14.744 5.39578 14.0767C3.4911 14.2245 2 15.2662 2 16.5294C2 17.8044 3.5173 18.8538 5.44734 18.986Z" fill="#D391B0"></path> <path d="M16.9999 7.5C16.9999 8.36825 16.7786 9.18482 16.3893 9.89636C16.5475 9.92583 16.7108 9.94126 16.8779 9.94126C18.2923 9.94126 19.4389 8.83512 19.4389 7.47063C19.4389 6.10614 18.2923 5 16.8779 5C16.7004 5 16.5272 5.01741 16.3599 5.05056C16.7674 5.77446 16.9999 6.61008 16.9999 7.5Z" fill="#D391B0"></path> <path d="M18.5526 18.986C20.4826 18.8538 21.9999 17.8044 21.9999 16.5294C21.9999 15.2662 20.5088 14.2245 18.6041 14.0767C19.1433 14.744 19.4999 15.5558 19.4999 16.5C19.4999 17.474 19.1205 18.3071 18.5526 18.986Z" fill="#D391B0"></path> </g></svg> },
                ].map((item) => (
                  <li className="nav-item" key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                      style={customStyles.pinkishPurple}
                    >
                      <span className="me-2" >{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                  className="btn w-100"
                  style={customStyles.outlineButton}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to sign out?")) {
                      firebase.auth().signOut();
                      navigate("/");
                    }
                  }}
                >
                  Logout
                </button>
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
                      New Announcement
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => openModal('upload')}
                    > Upload Files
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