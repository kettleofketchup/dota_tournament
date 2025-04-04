import { useState } from 'react'

import Avatar from '@mui/material/Avatar';

import { Icon } from "@iconify/react";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Placeholder from '~/components/placeholder';
export function Blog() {
  
  const [count, setCount] = useState(0)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <Box sx={{ height: "100%", width:"100%" }}>
      Blog Placeholder
      <Placeholder/>
    </Box>
    </>
  )

}

