'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material' //from tutorial
import { Autocomplete } from '@mui/material' //for my additions
import InventoryFilter from './filter.js'
// import firebase from 'firebase/app';
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  color: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const [filteredInv, setFilteredInv] = useState([])
  const [filterOn, setFilterOn] = useState(false)
  const [displayInv, setDisplayInv] = useState([])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    if(!filterOn) {
      setDisplayInv(inventoryList)
    }
  }
  
  
  useEffect(() => {
    updateInventory(); console.log(inventory);
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box id="site-wrapper"
        width="100vw"
        height="100vh"
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={2}
        sx={{ bgcolor: 'background.default' }}
      >

        {/* this pop-up window lets the user add an item */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{
                  backgroundColor: '#eee',
                  '& .MuiFormLabel-root': {
                    color: 'gray'
                  },
                  '& .MuiInputBase-input': {
                    color: 'gray'
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* opens up the add-item modal */}
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button> 

        <Button variant="contained" onClick={()=>console.log(inventory)}>
          Log inventory
        </Button>

        {/* inventory container*/}
        <Box border={'1px solid #333'}>

          <Box
            width="800px"
            height="100px"
            bgcolor={'#ADD8E6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'} >
              Inventory Items
            </Typography>
          </Box>
          
          <Box
            width="800px"
            display={'flex'}
            justifyContent={'center'}
            py={2}
          >
            <InventoryFilter states={{filteredInv, setFilteredInv: (x)=>setFilteredInv(x), inventory, setInventory: (x)=>setInventory(x), setFilterOn: (x)=>setFilterOn(x), displayInv, setDisplayInv: (x)=>setDisplayInv(x)}}/>
          </Box>

          {/* inventory items container*/}
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>


            {/* inventory items */}
            {
              // inventory.map(({name, quantity}) => (
              displayInv.map(({name, quantity}) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            )) 
            }

          </Stack>

        </Box>

      </Box>
    </ThemeProvider>
  )
}