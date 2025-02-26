import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        {/* רשימת הניווט הקיימת */}
        
        {/* כפתור הגרפים החדש */}
        <ListItem button component={Link} to="/graphs">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="גרפים" />
        </ListItem>
      </nav>
    </div>
  );
};

export default Sidebar; 