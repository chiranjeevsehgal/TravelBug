import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fab, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, CircularProgress } from "@mui/material";
import { TbMessageChatbot } from "react-icons/tb";
import axios from 'axios';
import { useState, useEffect } from 'react';

function RecommendationModal({ open, onClose, recommendation, loading }) {
  const formatText = (text) => {
    return text.split('\n').map((line, index) => {
      line = line.trim();
      if (line.startsWith('*')) {
        // Handle bullet points
        const bulletContent = line.substring(1).trim();
        return (
          <li key={index}>
            {formatInlineStyles(bulletContent)}
          </li>
        );
      } else {
        // Handle regular text
        return (
          <p key={index}>
            {formatInlineStyles(line)}
          </p>
        );
      }
    });
  };

  const formatInlineStyles = (text) => {
    let parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      } else {
        // Regular text, remove any remaining single asterisks
        return part.replace(/\*/g, '');
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Your Travel Recommendations</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </div>
        ) : (
          <DialogContentText component="div">
            <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
              {formatText(recommendation)}
            </ul>
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ScrollDialog() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [formData, setFormData] = useState({
    month: '',
    travelers: '',
    budget: '',
    activities: [],
    preferences: ''
  });
  const [packageDestinations, setPackageDestinations] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [openRecommendation, setOpenRecommendation] = useState(false);

  const [loading, setLoading] = useState(false);


  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      month: '',
      travelers: '',
      budget: '',
      activities: [],
      preferences: ''
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      activities: checked
        ? [...prevData.activities, name]
        : prevData.activities.filter(activity => activity !== name)
    }));
  };

 
  const handleGetRecommendations = async () => {
    const templateString = `We are total ${formData.travelers} people and want to travel in the month of ${formData.month}. Activities interested in: ${formData.activities.join(", ")}, having ${formData.budget} budget, ${formData.preferences}.`;
    console.log(templateString);

    handleClose(); // Close the input modal
    setLoading(true);
    setOpenRecommendation(true); // Open the recommendation modal immediately
    
    const response = await generateAnswer(templateString);
    setAiResponse(response);
    setLoading(false);
  };

  async function generateAnswer(message) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        {
          contents: [{ parts: [{ text: `${message} among places ${packageDestinations} (give top 3 places to travel and response in brief)` }] }],
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.log(error);
      return "Sorry, I couldn't generate recommendations at this time.";
    }
  }

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const res = await fetch(`/api/package/get-packages`);
        const data = await res.json();
        
        const destinations = data.packages.map(pkg => pkg.packageDestination);
        const destinationsString = destinations.join(", ");
        setPackageDestinations(destinationsString);
        console.log(destinationsString);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPackages();
  }, []);

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Fab
        onClick={handleClickOpen('paper')}
        color="primary"
        aria-label="edit"
        className="bottom-4 right-4"
      >
        <TbMessageChatbot size={24} />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">AI Place Recommender</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            Please answer the following questions to help us recommend the perfect travel destination for you:
          </DialogContentText>

          <FormControl fullWidth margin="normal">
            <InputLabel>Month of Travel</InputLabel>
            <Select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
            >
              <MenuItem value="jan">January</MenuItem>
              <MenuItem value="feb">February</MenuItem>
              {/* Add other months */}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Number of Travelers"
            type="number"
            name="travelers"
            value={formData.travelers}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Budget Range</InputLabel>
            <Select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
            >
              <MenuItem value="budget">Budget</MenuItem>
              <MenuItem value="midrange">Mid-range</MenuItem>
              <MenuItem value="luxury">Luxury</MenuItem>
            </Select>
          </FormControl>

          <FormGroup>
            <DialogContentText style={{ marginTop: '16px', marginBottom: '8px' }}>
              Preferred Activities:
            </DialogContentText>
            {['Beach', 'Hiking', 'Cultural Sites', 'Food Tours', 'Adventure Sports'].map((activity) => (
              <FormControlLabel
                key={activity}
                control={
                  <Checkbox
                    checked={formData.activities.includes(activity)}
                    onChange={handleCheckboxChange}
                    name={activity}
                  />
                }
                label={activity}
              />
            ))}
          </FormGroup>

          <TextField
            fullWidth
            margin="normal"
            label="Any specific preferences or requirements?"
            multiline
            rows={4}
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleGetRecommendations}>Get Recommendations</Button>
        </DialogActions>
      </Dialog>

      <RecommendationModal
        open={openRecommendation}
        onClose={() => {
          setOpenRecommendation(false);
          setAiResponse('');
        }}
        recommendation={aiResponse}
        loading={loading}
      />
    </React.Fragment>
  );
}