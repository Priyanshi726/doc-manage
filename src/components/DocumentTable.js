import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Typography, IconButton, Input, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Card, CardContent, Container,
  Box, Divider, Modal
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Logout from './Logout';
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';


const DocumentTable = () => {
  GlobalWorkerOptions.workerSrc = pdfWorker;
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFile, setNewDocFile] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedDocId, setEditedDocId] = useState();
  const [editedDocTitle, setEditedDocTitle] = useState('');
  const [editedDocDescription, setEditedDocDescription] = useState('');
  const [editedDocFile, setEditedDocFile] = useState('');
  const [numPages, setNumPages] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/documents')
      .then(response => setDocuments(response.data))
      .catch(error => {
        console.error('Error fetching documents:', error.response ? error.response.data : error.message);
        toast.error("Internal server error.",{
          toastId:"get-data-catch-error"
        });
      });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocFile(file);
    }
  };

  const handleDownload = (doc) => {
    const byteCharacters = atob(doc.content);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.type });
    saveAs(blob, `${doc.title}.${doc.type === 'application/pdf' ? 'pdf' : 'txt'}`);
  };


  const handleEditDocument = (doc) => {
    setEditedDocId(doc.id);
    setEditedDocTitle(doc.title);
    setEditedDocDescription(doc.description);
    setEditedDocFile(null); // Clear previously selected file
    setEditModalOpen(true);
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setViewModalOpen(true);
  };

  const handleAddDocument = () => {
    if (newDocDescription && newDocTitle && newDocFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const newDocument = {
          id: documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1,
          title: newDocTitle,
          description: newDocDescription,
          content: btoa(reader.result),
          type: newDocFile.type
        };
        axios.post('http://localhost:3000/documents', newDocument)
          .then(response => {
            setDocuments([...documents, response.data]);
            setNewDocDescription('');
            setNewDocTitle('');
            setNewDocFile(null);
            setOpen(false);
            toast.success("Document successfully added."); // Toaster on successful addition
          })
          .catch(error => console.error('Error adding document:', error));
      };
      reader.readAsBinaryString(newDocFile);
    } else {
      toast.error("Please fill in all fields and select a file.");
    }
  };

  const handleSaveEditedDocument = () => {
    if (editedDocTitle && editedDocDescription) {
      const updatedDocument = {
        id: editedDocId,
        title: editedDocTitle,
        description: editedDocDescription
      };
      axios.put(`http://localhost:3000/documents/${editedDocId}`, updatedDocument)
        .then(response => {
          const updatedDocuments = documents.map(doc => doc.id === editedDocId ? response.data : doc);
          setDocuments(updatedDocuments);
          setEditModalOpen(false);
          toast.success("Document successfully updated."); // Toaster on successful update
        })
        .catch(error => console.error('Error updating document:', error));
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (viewModalOpen && selectedDocument) {
      const newWindow = window.open();
      newWindow.document.write(
        `<iframe src="data:${selectedDocument.type};base64,${selectedDocument.content}" 
                  style="width: 100vw; height: 100vh; border: none;">
         </iframe>`
      );
    }
  }, [viewModalOpen, selectedDocument]);
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
   <>
    <ToastContainer />
    <Container maxWidth="ls" >
      <Card variant="outlined" style={{ marginTop: 20}}>
        <div>
          <Logout />
        </div>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" style={{fontWeight:550}}>
            Document Management
          </Typography>
          <div className="col-9 d-flex">
            <TextField
              style={{ backgroundColor: "#fff", borderRadius: "10px", width: "25%" }}
              name="search"
              value={searchTerm}
              onChange={handleSearchChange}
              label="Search documents..."
              type="search"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Divider style={{ margin: '20px 0' }} />
          {filteredDocuments.length === 0 ? (
        <Typography variant="body1" align="center" color="textSecondary">
          No documents found.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell  style={{fontSize:"14px",fontWeight:550}} align="left">Serial No.</TableCell>
                <TableCell style={{fontSize:"14px",fontWeight:550}} align="center">Title</TableCell>
                <TableCell style={{fontSize:"14px",fontWeight:550}} align="center">Description</TableCell>
               
                <TableCell style={{fontSize:"14px",fontWeight:550}} align="center">View</TableCell>
                <TableCell style={{fontSize:"14px",fontWeight:550}} align="center">Download</TableCell>
                <TableCell style={{fontSize:"14px",fontWeight:550}} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.map((doc, index) => (
                <TableRow key={doc.id}>
                  <TableCell style={{fontSize:"10px"}}  align="left">{index + 1}</TableCell>
                  <TableCell style={{fontSize:"10px"}}  align="center">{doc.title}</TableCell>
                  <TableCell style={{fontSize:"10px"}}  align="center">{doc.description}</TableCell>
                
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleViewDocument(doc)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleDownload(doc)}>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEditDocument(doc)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
        size='small'
          variant="contained"
          color="primary"
          style={{fontSize:"12px"}}
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
           Document
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: "5px" }}>
            Please enter the document title, description, and upload the document file.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Document Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Document Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newDocDescription}
            onChange={(e) => setNewDocDescription(e.target.value)}
          />
          <input
            accept=".pdf"
            style={{ display: 'none' }}
            id="new-doc-file"
            type="file"
            onChange={(e) => handleFileUpload(e)}
          />
          <label htmlFor="new-doc-file">
            <Button variant="contained" color="primary" component="span" style={{ marginTop: '10px' }}>
              Upload File
            </Button>
          </label>
          {newDocFile && (
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              Selected file: {newDocFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddDocument} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Document</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: "5px" }}>
            Edit the document title, description, and upload a new document file.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Document Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editedDocTitle}
            onChange={(e) => setEditedDocTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Document Description"
            type="text"
            fullWidth
            variant="outlined"
            value={editedDocDescription}
            onChange={(e) => setEditedDocDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditedDocument} color="primary">
            Save 
          </Button>
        </DialogActions>
      </Dialog>
             </CardContent>
      </Card>
    </Container>
   
   </>
  );
};

export default DocumentTable;
