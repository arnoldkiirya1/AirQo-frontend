import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';
import constants from '../../../config/constants.js';
import TextField from '@material-ui/core/TextField';  
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Update, AddOutlined, EditOutlined, CloudUploadOutlined, UndoOutlined, PageviewOutlined, EventBusy } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CreatableSelect from 'react-select/creatable';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  link: {
    color: '#3344AA',
    fontFamily: 'Open Sans'
    },
    
  table: {
    fontFamily:'Open Sans'
  },
formControl: {
  minWidth: 200,
},
input: {
  color: 'black',
  fontFamily: 'Open Sans',
  fontweight:500,
  font: '100px',
  fontSize: 17
},
paper: { 
  minWidth: "400px" 
},

}));


const DevicesTable = props => {
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 350,
    },
  },
};
  const { className, users, ...rest } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);   
  const [isLoading, setIsLoading] = useState(false);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [dialogResponseMessage, setDialogResponseMessage] = useState('');

  const [registerOpen, setRegisterOpen] = useState(false);
  const handleRegisterOpen = () => {
    setRegisterOpen(true);
  };
  const handleRegisterClose = () => {
    setRegisterOpen(false);
    setRegisterName('');
    setLatitude('0.332269');
    setLongitude('32.570077');
    setVisibility('');
    setManufacturer('');
    setProductName('');
    setOwner('');
    setISP('');
    setPhone(null);
    setDescription('');
  };

  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setRegisterName('');
    setLatitude('0.332269');
    setLongitude('32.570077');
    setVisibility('');
    setManufacturer('');
    setProductName('');
    setOwner('');
    setISP('');
    setPhone(null);
    setDescription('');
  };

  const [maintenanceOpen, setMaintenanceOpen]= useState(false);
  const handleMaintenanceOpen = () => {
    setMaintenanceOpen(true);
  };
  const handleMaintenanceClose = () => {
    setMaintenanceOpen(false);
    setMaintenanceDescription([]);
    setLocationID('');
    setMaintenanceType('');
    setSelectedDate(new Date());
  };

  const [deployOpen, setDeployOpen]= useState(false);
  const handleDeployOpen = () => {
    setDeployOpen(true);
  };
  const handleDeployClose = () => {
    setDeployOpen(false);
    setDeviceName('');
    setLocationID('');
    setInstallationType('');
    setHeight('');
    setPower('');
    setDeploymentDate(new Date());
    setLatitude('');
    setLongitude('');
    setPrimaryChecked(true);
    setCollocationChecked(false);
    setDevicesLabel('');
  };

  const [recallOpen, setRecallOpen] = useState(false);
  const handleRecallOpen = () => {
    setRecallOpen(true);
  };
  const handleRecallClose = () => {
    setRecallOpen(false);
    setDeviceName('');
    setLocationID('');
    setRecallDate(new Date());
  }

  const [sensorOpen, setSensorOpen] = useState(false);
  const handleSensorOpen = () => {
    setSensorOpen(true);
  };
  const handleSensorClose = () => {
    setSensorOpen(false);
    setDeviceName('');
    setSensorName('');
    setQuantityKind([]);
  }

  const [responseOpen, setResponseOpen] = useState(false);
  const handleResponseOpen = () => {
    setResponseOpen(true);
  };
  const handleResponseClose = () => {
    setResponseOpen(false);
  };

  const [hasError, setHasError] = useState(false); 
  //maintenance log parameters
  const maintenanceOptions = [
    "Dust blowing and sensor cleaning",
    "Site update check",
    "Device equipment check",
    "Power circuitry and components works",
    "GPS module works/replacement",
    "GSM module works/replacement",
    "Battery works/replacement",
    "Power supply works/replacement",
    "Antenna works/replacement",
    "Mounts replacement",
    "Software checks/re-installation",
    "PCB works/replacement",
    "Temp/humidity sensor works/replacement",
    "Air quality sensor(s) works/replacement"
  ];

  const [deviceName, setDeviceName] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const handleMaintenanceTypeChange = type =>{
    setMaintenanceType(type.target.value);
    if (type.target.value == 'Preventive Maintenance'){
      setMaintenanceDescription(["Dust blowing and sensor cleaning","Site update check","Device equipment check",])
    }
    else{
      setMaintenanceDescription([]);
    }
  }
  //const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [maintenanceDescription, setMaintenanceDescription] = useState([]);
  const handleMaintenanceDescriptionChange = description => {
    setMaintenanceDescription(description.target.value);
  } 

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  //sensor parameters
  const quantityOptions = ["PM 1(µg/m3)", "PM 2.5(µg/m3)", "PM 10(µg/m3)", "External Temperature(\xB0C)", 
  "External Temperature(\xB0F)", "External Humidity(%)", "Internal Temperature(\xB0C)", "Internal Humidity(%)", 
  "Battery Voltage(V)", "GPS"];

  const convertQuantityOptions= (myArray) => {
    let newArray = [];
    for (let i=0; i<myArray.length; i++){
      if (myArray[i]=="PM 1(µg/m3)"){
        newArray.push({"quantityKind":"PM 1", "measurementUnit":"µg/m3"})
      }
      else if (myArray[i]=="PM 2.5(µg/m3)"){
        newArray.push({"quantityKind":"PM 2.5", "measurementUnit":"µg/m3"})
      }
      else if (myArray[i]=="PM 10(µg/m3)"){
        newArray.push({"quantityKind":"PM 10", "measurementUnit":"µg/m3"})
      }
      else if (myArray[i]=="External Temperature(\xB0C)"){
        newArray.push({"quantityKind":"External Temperature", "measurementUnit":"\xB0C"})
      }
      else if (myArray[i]=="External Temperature(\xB0F)"){
        newArray.push({"quantityKind":"External Temperature", "measurementUnit":"\xB0F"})
      }
      else if (myArray[i]=="External Humidity(%)"){
        newArray.push({"quantityKind":"External Humidity", "measurementUnit":"%"})
      }
      else if (myArray[i]=="Internal Temperature(\xB0C)"){
        newArray.push({"quantityKind":"Internal Temperature", "measurementUnit":"\xB0C"})
      }
      else if (myArray[i]=="Internal Humidity(%)"){
        newArray.push({"quantityKind":"Internal Humidity", "measurementUnit":"%"})
      }
      else if (myArray[i]=="Battery Voltage(V)"){
        newArray.push({"quantityKind":"Battery Voltage", "measurementUnit":"V"})
      }
      else if (myArray[i]=="GPS"){
        newArray.push({"quantityKind":"GPS", "measurementUnit":"coordinates"})
      }
      else{
        newArray.push({"quantityKind":"unknown", "measurementUnit":"unknown"})
      }
     
    }
    return newArray;
  }

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const [sensorID, setSensorID] = useState('');
  const handleSensorIDChange = id => {
    setSensorID(id.target.value);
  }                       
  const [sensorName, setSensorName] = useState('');
  const handleSensorNameChange = name =>{
    setSensorName(name.target.value);
    if (name.target.value == 'Alphasense OPC-N2'){
      setQuantityKind(["PM 1(µg/m3)", "PM 2.5(µg/m3)", "PM 10(µg/m3)"])
    }
    else if (name.target.value == 'pms5003'){
      setQuantityKind(["PM 2.5(µg/m3)", "PM 10(µg/m3)"])
    }
    else if (name.target.value == 'DHT11'){
      setQuantityKind(["Internal Temperature(\xB0C)", "Internal Humidity(%)"])
    }
    else if (name.target.value == 'Lithium Ion 18650'){
      setQuantityKind(["Battery Voltage(V)"])
    }
    else if (name.target.value == 'Generic'){
      setQuantityKind(["GPS"])
    }
    else if (name.target.value == 'Purple Air II'){
      setQuantityKind(["PM 1(µg/m3)"])
    }
    else if (name.target.value == 'Bosch BME280'){
      setQuantityKind(["External Temperature(\xB0C)", "External Humidity(%)"])
    }
    else{
      setQuantityKind([]);
    }
  }
  const [quantityKind, setQuantityKind] = useState([]);
  
  const handleQuantityKindChange = quantity => {
    console.log(quantity.target.value);
    setQuantityKind(quantity.target.value);
  } 

    
  const getQuantityName = (name, quantityOptions) =>{
    for (let i=0; i<quantityOptions.length; i++){
      if (quantityOptions[i].name===name){
        return quantityOptions[i].name
      } 
    }
    return "";
  }
  const [measurementUnit, setMeasurementUnit] = useState([]);
  const handleMeasurementUnitChange = unit => {
    setMeasurementUnit(unit.target.value);
  }
  
  //deployment parameters
  const [recallDate, setRecallDate] = useState(new Date());
  const [locationsOptions, setLocationsOptions] = useState([]);
  
  useEffect(() => {
    axios.get(
      constants.ALL_LOCATIONS_URI
    )
    .then(
      res=>{
        const ref = res.data;
        console.log(ref);
        let locationArray = [];
        for (var i=0; i<ref.length; i++){
          locationArray.push({"loc_ref":ref[i].loc_ref, "loc_name":ref[i].location_name, "loc_desc":ref[i].description})
        }
        console.log("location array");
        console.log(locationArray);
        setLocationsOptions(locationArray);

    }).catch(
      console.log
    )
  }, []);

  const [devicesInLocation, setDevicesInLocation] = useState([]);
  const [devicesLabel, setDevicesLabel] = useState('');

  let locationCoordinates = (loc_ref) => {
    axios.get(
      constants.EDIT_LOCATION_DETAILS_URI+loc_ref
    )
    .then(
      res => {
        const ref = res.data;
        setLatitude(ref.latitude);
        setLongitude(ref.longitude);
      }
    );

  }

  const [locationID, setLocationID] = useState('');
  const handleLocationIDChange = (event) => {
    let myLocation = event.target.value;
    console.log('changing location');
    console.log(myLocation);
    setLocationID(myLocation);
    locationCoordinates(myLocation);
    console.log('Getting devices in location '+myLocation)
    console.log(constants.DEVICES_IN_LOCATION_URI+myLocation)
    axios.get(
      constants.DEVICES_IN_LOCATION_URI+myLocation
    )
    .then(
      res=>{
        const ref = res.data;
        console.log(ref);
      
        let devicesArray = [];
        if (ref.length != 0){
          for (var i=0; i<ref.length; i++){
            devicesArray.push(ref[i].name);
        }
        setDevicesLabel(devicesArray.join(', ')+ ' found in '+ myLocation);
      }
        else{
          setDevicesLabel('No devices found in '+ myLocation);
        }

    }).catch(
      console.log
    )
  }
  const [height, setHeight] = useState('');
  const handleHeightChange = enteredHeight => {
    let re = /\s*|\d+(\.d+)?/
    if (re.test(enteredHeight.target.value)) {
      setHeight(enteredHeight.target.value);
    }
  }
  const [power, setPower] = useState('');
  const handlePowerChange = (event) => {
	  setPower(event.target.value);
  }

  const [installationType, setInstallationType] = useState('');
  const handleInstallationTypeChange = enteredInstallationType => {
	  setInstallationType(enteredInstallationType.target.value);
  }

  const [deploymentDate, setDeploymentDate] = useState(new Date());
  const handleDeploymentDateChange = (date) => {
    setDeploymentDate(date);
  };

  const [primaryChecked, setPrimaryChecked] = useState(true);
  const handlePrimaryChange = (event) => {
    setPrimaryChecked(false);
  }

  const [collocationChecked, setCollocationChecked] = useState(false);
  const handleCollocationChange = (event) => {
    setCollocationChecked(true);
  }

  //Edit parameters
  const [deviceID, setDeviceID] = useState('');

  //Register and Edit parameters
  const [sensorsOptions, setSensorsOptions] = useState([]);
  
  useEffect(() => {
    axios.get(
      constants.ALL_SENSORS_URI
    )
    .then(
      res=>{
        const ref = res.data;
        console.log(ref);
        let sensorArray = [];
        for (var i=0; i<ref.length; i++){
          sensorArray.push(ref[i]);
        }
        setSensorsOptions(sensorArray);

    }).catch(
      console.log
    )
  }, []);

  const [registerName, setRegisterName] = useState('');
  const handleRegisterNameChange = name => {
	  setRegisterName(name.target.value);
  }
  const [manufacturer, setManufacturer] = useState('');
  const handleManufacturerChange = manufacturer => {
	  setManufacturer(manufacturer.target.value);
  }
  const [productName, setProductName] = useState('');
  const handleProductNameChange = name => {
	  setProductName(name.target.value);
  }
  const [owner, setOwner] = useState('');
  const handleOwnerChange = name => {
	  setOwner(name.target.value);
  }
  const [description, setDescription] = useState('');
  const handleDescriptionChange = (event) => {
	  setDescription(event.target.value);
  }
  const [visibility, setVisibility] = useState('');
  const handleVisibilityChange = (event) => {
	  setVisibility(event.target.value);
  }
  const [ISP, setISP] = useState('');
  const handleISPChange = (event) => {
	  setISP(event.target.value);
  }

  const [latitude, setLatitude] = useState('0.332269');
  const handleLatitudeChange = lat => {
    let re = /\s*|\d+(\.d+)?/
    if (re.test(lat.target.value)) {
      setLatitude(lat.target.value);
    }
  }
  const [longitude, setLongitude] = useState('32.570077');
  const handleLongitudeChange = long => {
    let re = /\s*|\d+(\.d+)?/
    if (re.test(long.target.value)) {
      setLongitude(long.target.value);
    }
  }
  const [phone, setPhone] = useState(null);
  const handlePhoneChange = event => {
    let re = /\s*|\d+(\.d+)?/
    if (re.test(event.target.value)) {
      setPhone(event.target.value);
    }
  }

  useEffect(() => {
    console.log('Getting devices ..');
    axios.get(
      constants.ALL_DEVICES_URI
    )
    .then(
      res=>{
        setIsLoading(false);
        const ref = res.data;
        console.log('Devices loading')
        console.log(ref);
        setData(ref);

    }).catch(
      console.log
    )
  }, []);
 

  function appendLeadingZeroes(n) {
    if (n <= 9) {
      return '0' + n;
    }
    return n;
  }

  let formatDate = (date) => {
    let time = appendLeadingZeroes(date.getDate()) +
    '-' +
    appendLeadingZeroes(date.getMonth() + 1) +
    '-' +
    date.getFullYear()

    return time;
   }
  
  let handleEditClick = (name, manufacturer,product, owner, description, visibility, ISP, lat, long, phone, channelID) => {
    return (event) => {
      console.log(name);
      setRegisterName(name);
      setManufacturer(manufacturer);
      setProductName(product);
      setOwner(owner);
      setDescription(description);
      setVisibility(visibility);
      setISP(ISP);
      setLatitude(lat);
      setLongitude(long);
      setPhone(phone);
      setDeviceID(channelID);
      handleEditOpen();

    }
  }

  let handleMaintenanceClick = (name, location) => {
    return (event) => {
      console.log(name);
      setDeviceName(name);
      setLocationID(location);
      handleMaintenanceOpen();
    }
  }

  let handleRecallClick = (name, location) => {
    return (event) => {
      console.log(name);
      setDeviceName(name);
      setLocationID(location);
      setRecallDate(new Date());
      handleRecallOpen();
    }
  }

  let handleDeployClick = (name) => {
    return (event) => {
      console.log('Deploying '+name);
      setDeviceName(name);
      handleDeployOpen();
    }
  }

  let handleSensorClick = (name) => {
    return (event) => {
      console.log('Adding sensors to channel '+name);
      setDeviceName(name);
      //setDeviceID(id);
      handleSensorOpen();
    }
  }

  
  let handleDeploySubmit = (e) => {
       
    let filter ={ 
      deviceName: deviceName,
      locationName: locationID,
      mountType: installationType,
      height: height,
      powerType: power,
      date: deploymentDate,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      isPrimaryInLocation: primaryChecked,
      isUserForCollocaton: collocationChecked
    }
    console.log(JSON.stringify(filter));
    console.log(constants.DEPLOY_DEVICE_URI+"deploy");
    /*
    axios.post(
      constants.DEPLOY_DEVICE_URI+"deploy",
      JSON.stringify(filter),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(
      res=>{
        console.log('Response returned')
        const myData = res.data;
        console.log(myData.message);
        setDialogResponseMessage('Device successfully deployed');
        handleDeployClose();
        setResponseOpen(true);
    }).catch(error => {
      console.log(error.message)
      setDialogResponseMessage('Device already deployed');
      handleDeployClose();
      setResponseOpen(true);

  })*/
  }
  
  let  handleMaintenanceSubmit = (e) => {
      let filter ={ 
      deviceName: deviceName,
      locationName: locationID,
      description: maintenanceType,
      tags:  maintenanceDescription,  
      date:selectedDate
    }
    console.log(JSON.stringify(filter));
    
    axios.post(
      constants.DEPLOY_DEVICE_URI+"maintain",
      JSON.stringify(filter),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(
      res=>{
        const myData = res.data;
        console.log(myData.message);
        setDialogResponseMessage('Maintenance log updated');
        handleMaintenanceClose();
        setResponseOpen(true);
    }).catch(error => {
      console.log(error.message)
      setDialogResponseMessage('An error occured. Please try again');
      handleMaintenanceClose();
      setResponseOpen(true);

  })
  }

  let handleRecallSubmit = (e) => {
    let filter ={ 
      deviceName: deviceName,
      locationName: locationID,
      date: recallDate,
      
    }
    console.log(JSON.stringify(filter));
    console.log(constants.DEPLOY_DEVICE_URI+"recall",);

    axios.post(
      constants.DEPLOY_DEVICE_URI+"recall",
      JSON.stringify(filter),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(
      res=>{
        console.log('Response returned')
        const myData = res.data;
        console.log(myData.message);
        setDialogResponseMessage('Device successfully recalled');
        handleRecallClose();
        setResponseOpen(true);
    }).catch(error => {
      setDialogResponseMessage('Device is not deployed in any location');
      handleRecallClose();
      setResponseOpen(true);
      

  })

  }

  let handleRegisterSubmit = (e) => {
    console.log('Registering');
    let filter = {
      name: registerName,
      latitude: latitude,
      longitude: longitude,
      visibility: visibility,
      device_manufacturer: manufacturer,
      product_name:productName,
      owner: owner,
      ISP: ISP,
      phoneNumber: phone,
      description: description,
    }
    console.log(JSON.stringify(filter));
   
    axios.post(
      constants.REGISTER_DEVICE_URI,
      JSON.stringify(filter),
      { headers: { 'Content-Type': 'application/json' } },
    ) 
    .then(
      res=>{
        console.log('RESPONSE');
        const myData = res.data;
        console.log(myData.message);
        setDialogResponseMessage('Device successfully registered')
        handleRegisterClose();
        setResponseOpen(true);
    }).catch(error => {
        console.log(error.message)
        setDialogResponseMessage('An error occured. Please check your inputs and try again');
        handleRegisterClose();
        setResponseOpen(true);
  
    })
  }

  let handleEditSubmit = (e) => {
    console.log('Updating');
    let filter = {
      name: registerName,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      visibility: visibility,
      device_manufacturer: manufacturer,
      product_name:productName,
      owner: owner,
      ISP: ISP,
      phoneNumber: phone,
      description: description,
    }
    console.log(JSON.stringify(filter));
    axios.put(
      constants.EDIT_DEVICE_URI+deviceID.toString(),
      JSON.stringify(filter),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(
      res=>{
        const myData = res.data;
        console.log(myData.message);
        setDialogResponseMessage('Device successfully updated')
        handleEditClose();
        setResponseOpen(true);  
    }).catch(error => {
      console.log(error.message)
      setDialogResponseMessage('An error ocuured.Please check your inputs and try again');
      handleEditClose();
      setResponseOpen(true);
  })
  }

  let handleSensorSubmit = (e) => {
    console.log('Quantity Kind');
    console.log(quantityKind);
    let filter = {
      description:sensorName, //e.g. pms5003
      measurement: convertQuantityOptions(quantityKind),//e.g. [{"quantityKind":"humidity", "measurementUnit":"%"}]
    }
    console.log(JSON.stringify(filter));
    
    axios.post(
      constants.ADD_COMPONENT_URI+deviceName,
      JSON.stringify(filter),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(
      res=>{
        const myData = res.data;
        console.log(myData.message);
        setDialogResponseMessage('Component successfully added');
        handleSensorClose();
        setResponseOpen(true);
    }).catch(error => {
      console.log(error.message)
      setDialogResponseMessage('An error occured. Please try again');
      handleSensorClose();
      setResponseOpen(true);

  })
  }


  return (
    <div className={classes.root}>
      <br/>
      <Grid container alignItems="right" alignContent="right" justify="center">
     <Button 
          variant="contained" 
          color="primary"              
          type="submit"
          align = "right"
          onClick={handleRegisterOpen}
        > Add Device
        </Button>
     </Grid>
      <br/>

    <LoadingOverlay
      active={isLoading}
      spinner
      text='Loading Devices...'
    >
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <MaterialTable
            className = {classes.table}
            title="Device Registry"
            columns={[
             { title: 'Device Name', field: 'name', cellStyle:{ fontFamily: 'Open Sans'},
             render: rowData => {
               return (
                 rowData.isActive?
                   <Link className={classes.link} to={`/device/${rowData.channelID}`}>{rowData.name}</Link>:
                   <p>{rowData.name}</p>
               );
             }},
             { title: 'Description', field: 'description', cellStyle:{ fontFamily: 'Open Sans'} },
             { title: 'Device ID', field: 'channelID', cellStyle:{ fontFamily: 'Open Sans'} }, //should be channel ID
             { title: 'Registration Date', 
               field: 'createdAt', 
               cellStyle:{ fontFamily: 'Open Sans'},
               render: rowData => formatDate(new Date(rowData.createdAt))
             },
             { title: 'Location ID',  
               field: 'locationID',
               cellStyle:{ fontFamily: 'Open Sans'},
               render: rowData => <Link className={classes.link} to={`/locations/${rowData.locationID}`}>{rowData.locationID}</Link>
             },
             { title: 'Actions',
               render: rowData => {
                 return(
                   <div>
                    {rowData.isActive?
                      <Tooltip title="View Device Details">                                   
                        <Link className={classes.link} to={`/device/${rowData.channelID}`}>                                                                               
                          <PageviewOutlined></PageviewOutlined>
                        </Link> 
                      </Tooltip>:
                      <Tooltip title="Link disabled for inactive device">                                                                                                    
                        <PageviewOutlined></PageviewOutlined>
                      </Tooltip>
                     } &nbsp;&nbsp;
                      <Tooltip title="Edit a device">
                        <Link 
                        className={classes.link} 
                        onClick = {handleEditClick(rowData.name, rowData.device_manufacturer, rowData.product_name, 
                        rowData.owner, rowData.description, rowData.visibility, rowData.ISP, rowData.latitude,
                        rowData.longitude, rowData.phoneNumber, rowData.channelID)}
                        > 
                          <EditOutlined></EditOutlined>
                        </Link> 
                      </Tooltip>
                      &nbsp;&nbsp;&nbsp;
                      <Tooltip title="Update Maintenance Log">
                        <Link
                        className={classes.link} 
                        onClick = {handleMaintenanceClick(rowData.name, rowData.locationID)}
                        > 
                          <Update></Update>
                        </Link> 
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Deploy Device">
                        <Link 
                        className={classes.link} 
                        onClick = {handleDeployClick(rowData.name)}
                        > 
                          <CloudUploadOutlined></CloudUploadOutlined>
                        </Link>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Recall Device">
                        <Link 
                        className={classes.link} 
                        onClick = {handleRecallClick(rowData.name, rowData.locationID)}
                        > 
                          <UndoOutlined></UndoOutlined>
                        </Link>
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Add Component">
                        <Link 
                        className={classes.link} 
                        onClick = {handleSensorClick(rowData.name)}
                        > 
                          <AddOutlined></AddOutlined>
                        </Link>
                      </Tooltip>
                    </div>
                                    )
            },
          }
      ]}   
      data = {data}  
      options={{
        search: true,
        exportButton: true,
        searchFieldAlignment: 'left',
        showTitle: false,
        searchFieldStyle: {
          fontFamily: 'Open Sans',
          border: '2px solid #7575FF',
        },
        headerStyle: {
          fontFamily: 'Open Sans',
          fontSize: 16,
          fontWeight: 600
        },
        pageSizeOptions : [10, 25, 50, data.length],
        pageSize: 10
      }}
    />
        </PerfectScrollbar> 
      </CardContent> 
      </Card>

    </LoadingOverlay>

    {responseOpen?
    (
      <Dialog
      open={responseOpen}
      onClose={handleResponseClose}
      aria-labelledby="form-dialog-title"
      aria-describedby="form-dialog-description"
      >
        <DialogContent>
          {dialogResponseMessage}
        </DialogContent> 
        
        <DialogActions>
          <Grid container alignItems="center" alignContent="center" justify="center">
            <Button 
              variant="contained" 
              color="primary"              
              onClick={handleResponseClose}
            > OK
            </Button>
          </Grid>
        </DialogActions>
    </Dialog>


    ): null
    
  }

    {maintenanceOpen? (
       
       <Dialog
           open={maintenanceOpen}
           onClose={handleMaintenanceClose}
           aria-labelledby="form-dialog-title"
           aria-describedby="form-dialog-description"
         >
           <DialogTitle id="form-dialog-title">Update Maintenance Log</DialogTitle>

           
           <DialogContent>
                <div style ={{width:300}}>
                 <TextField 
                   id="deviceName" 
                   label="Device Name"
                   value = {deviceName}
                   fullWidth = {true}
                   /> <br/>
                   <FormControl required className={classes.formControl} fullWidth = {true}>
                      <InputLabel htmlFor="demo-dialog-native">Type of Maintenance</InputLabel>
                      <Select
                        native
                        value={maintenanceType}
                        onChange={handleMaintenanceTypeChange}
                        input={<Input id="demo-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        <option value="Preventive Maintenance">Preventive</option>
                        <option value="Corrective Maintenance">Corrective</option>
                      </Select>
                  </FormControl><br/>
                  <FormControl required className={classes.formControl} fullWidth = {true}>
                      <InputLabel htmlFor="demo-dialog-native">Description of Activities</InputLabel>
                      <Select
                        multiple
                        value={maintenanceDescription}
                        onChange={handleMaintenanceDescriptionChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                       <option aria-label="None" value="" />
                       {maintenanceOptions.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={maintenanceDescription.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                       ))}
                      </Select>
                  </FormControl><br/>

                 <MuiPickersUtilsProvider utils={DateFnsUtils} fullWidth = {true}>
                  <KeyboardDatePicker 
                    fullWidth = {true}
                    disableToolbar
                    variant="inline"
                    //format="MM/dd/yyyy"
                    format = "yyyy-MM-dd"
                    margin="normal"
                    id="maintenanceDate"
                    label="Date of Maintenance"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                   }}
                   />
                 </MuiPickersUtilsProvider>
                 </div>
                 
                  </DialogContent> 
          
                 <DialogActions>
                 <Grid container alignItems="center" alignContent="center" justify="center">
                 <Button 
                  variant="contained" 
                  color="primary"              
                  onClick={handleMaintenanceSubmit}
                 > Update
                </Button>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button 
                variant="contained" 
                color="primary"              
                onClick = {handleMaintenanceClose}
               > Cancel
               </Button>
               </Grid>
           </DialogActions>
         </Dialog>
         ) : null}

  {deployOpen? (
       
       <Dialog
           open={deployOpen}
           onClose={handleDeployClose}
           aria-labelledby="form-dialog-title"
           aria-describedby="form-dialog-description"
         >
           <DialogTitle id="form-dialog-title" style={{alignContent:'center'}}>Deploy a device</DialogTitle>
           
           <DialogContent>
             <Grid container spacing={1}>
               <Grid container item xs={12} spacing={3}>
                 <Grid item xs={6}>
                   <TextField 
                     id="standard-basic" 
                     label="Device Name"
                     value = {deviceName}
                     required
                     fullWidth = {true} 
                   /> 
                 </Grid>
                 <Grid item xs={6}>
                    <TextField 
                      id="standard-basic" 
                      label="height" 
                      value = {height}
                      onChange = {handleHeightChange}
                      fullWidth = {true} 
                    />
                 </Grid> 
                </Grid>
                <Grid container item xs={12} spacing={3}>
                 <Grid item xs={6}>
                   <FormControl required className={classes.formControl} fullWidth = {true} >
                     <InputLabel htmlFor="demo-dialog-native">Location ID</InputLabel>
                     <Select
                       native
                       required
                       value={locationID}
                       onChange={handleLocationIDChange}
                       input={<Input id="demo-dialog-native" />}
                      
                     > 
                       <option aria-label="None" value="" />
                       {locationsOptions.map( (location) => 
                       (location.loc_name=="")||(location.loc_name==null)?
                       <option value={location.loc_ref}>{location.loc_ref}: {location.loc_desc}</option>:
                       <option value={location.loc_ref}>{location.loc_ref}: {location.loc_name}</option>
                       
                       )}
                     </Select>
                   </FormControl>
                       <h6 style = {{fontSize:14}}><b>{devicesLabel}</b></h6>
                  </Grid>
                    
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl} fullWidth = {true} >
                      <InputLabel htmlFor="demo-dialog-native">Power Type</InputLabel>
                      <Select
                        native
                        value={power}
                        onChange={handlePowerChange}
                        input={<Input id="demo-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        <option value="Mains">Mains</option>
                        <option value="Solar">Solar</option>
                        <option value="Battery">Battery</option>
                      </Select>
                    </FormControl>
                   </Grid> 
                  </Grid>
                    <div>
                  <Grid container item xs={12} spacing={3}>
                    <Grid item xs={6}>
                      <TextField 
                        id="standard-basic" 
                        label="Installation Type" 
                        value = {installationType}
                        onChange = {handleInstallationTypeChange}
                        fullWidth = {true} 
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            fullWidth = {true} 
                            disableToolbar
                            format = "yyyy-MM-dd"
                            id="deploymentDate"
                            label="Date of Deployment"
                            value={deploymentDate}
                            onChange={handleDeploymentDateChange}
                            required
                            
                            KeyboardButtonProps={{
                               'aria-label': 'change date',
                            }}
                          />
                        </MuiPickersUtilsProvider>

                      </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={primaryChecked}
                            onChange={handlePrimaryChange}
                            name="primaryDevice"
                            color="primary"
                          />
                        } 
                        label="I wish to make this my primary device in this location"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={collocationChecked}
                            onChange={handleCollocationChange}
                            name="collocation"
                            color="primary"
                          />
                        } 
                      label="This deployment is a formal collocation"
                      />
                    </Grid> </div> 
                  </Grid>
                </DialogContent> 
          
                <DialogActions>
                <Grid container alignItems="center" alignContent="center" justify="center">
                 <Button 
                  variant="contained" 
                  color="primary"              
                  onClick={handleDeploySubmit}
                 > Deploy
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button 
                variant="contained" 
                color="primary"              
                onClick = {handleDeployClose}
               > Cancel
               </Button>
               </Grid>
           </DialogActions> 
         </Dialog>
         ) : null}
  {recallOpen? (
       
       <Dialog
           open={recallOpen}
           onClose={handleRecallClose}
           aria-labelledby="form-dialog-title"
           aria-describedby="form-dialog-description"
         >
           <DialogTitle id="form-dialog-title" style={{alignContent:'center'}}>Recall a device</DialogTitle>
           
                <DialogContent>
                  Are you sure you want to recall device {deviceName} from location {locationID}?
                </DialogContent> 
          
          
                <DialogActions>
                <Grid container alignItems="center" alignContent="center" justify="center">
                 <Button 
                  variant="contained" 
                  color="primary"              
                  onClick = {handleRecallSubmit}
                 > YES
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button 
                variant="contained" 
                color="primary"              
                onClick = {handleRecallClose}
               > NO
               </Button>
               </Grid>
           </DialogActions>
         </Dialog>
         ) : null}

     {registerOpen? (
       
       <Dialog
           open={registerOpen}
           onClose={handleRegisterClose}
           aria-labelledby="form-dialog-title"
           aria-describedby="form-dialog-description"
         >
           <DialogTitle id="form-dialog-title">Add a device</DialogTitle>

           <DialogContent>
              <form className={classes.formControl}> 
                 <TextField 
                   required
                   id="deviceName" 
                   value = {registerName}
                   onChange = {handleRegisterNameChange}
                   label="Device Name"
                   fullWidth = {true}                 
                   /><br/>
                 <TextField 
                   id="standard-basic" 
                   label="Description" 
                   value = {description}
                   onChange = {handleDescriptionChange}
                   fullWidth = {true}
                   required
                   /><br/>
                  <TextField 
                   id="standard-basic" 
                   label="Manufacturer" 
                   value = {manufacturer}
                   onChange = {handleManufacturerChange}
                   fullWidth = {true}
                   /><br/>
                   <TextField 
                   id="standard-basic" 
                   label="Product Name" 
                   value = {productName}
                   onChange = {handleProductNameChange}
                   fullWidth = {true}
                   /><br/>
                   <TextField 
                   id="standard-basic" 
                   label="Latitude" 
                   value = {latitude}
                   onChange = {handleLatitudeChange}
                   fullWidth = {true}
                   required
                   /><br/>
                   <TextField 
                   id="standard-basic" 
                   label="Longitude" 
                   value = {longitude}
                   onChange = {handleLongitudeChange}
                   fullWidth = {true}
                   required
                   /><br/>
                   <FormControl required  fullWidth={true}>
                      <InputLabel htmlFor="demo-dialog-native"> Data Access</InputLabel>
                      <Select
                        required
                        native
                        value={visibility}
                        onChange={handleVisibilityChange}
                        input={<Input id="demo-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </Select>
                   </FormControl>
                   <TextField 
                   required
                   id="standard-basic" 
                   label="Owner" 
                   value = {owner}
                   onChange = {handleOwnerChange}
                   fullWidth = {true}
                   /><br/>
                   <FormControl fullWidth={true}>
                      <InputLabel htmlFor="demo-dialog-native"> Internet Service Provider</InputLabel>
                      <Select
                        native
                        value={ISP}
                        onChange={handleISPChange}
                        input={<Input id="demo-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        <option value="MTN">MTN</option>
                        <option value="Africell">Africell</option>
                        <option value="Airtel">Airtel</option>
                      </Select>
                   </FormControl>
                   <TextField 
                   id="standard-basic" 
                   label="Phone Number" 
                   value = {phone}
                   onChange = {handlePhoneChange}
                   fullWidth = {true}
                   /><br/>
                   </form>
                   </DialogContent>

                   <DialogActions>
                  
                <Grid container alignItems="center" alignContent="center" justify="center">
                 <Button 
                  variant="contained" 
                  color="primary"  
                  type ="submit"            
                  onClick={handleRegisterSubmit}
                 > Register
                </Button>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button 
                variant="contained" 
                color="primary"              
                type="button"
                onClick = {handleRegisterClose}
               > Cancel
               </Button>
               </Grid> <br/>
              </DialogActions>
         </Dialog>
         ) : null}

     {editOpen? (
       
       <Dialog
           open={editOpen}
           onClose={handleEditClose}
           aria-labelledby="form-dialog-title"
           aria-describedby="form-dialog-description"
         >
           <DialogTitle id="form-dialog-title">Edit a device</DialogTitle>

           <DialogContent>
                <form  className={classes.formControl}> 
                 <TextField 
                   required
                   id="standard-basic" 
                   label="Device Name"
                   value = {registerName}
                   fullWidth = {true}
                   onChange = {handleRegisterNameChange} 
                   InputProps={{
                    readOnly:true
                }}
                   /> <br/>
                 <TextField 
                   id="standard-basic" 
                   label="Description" 
                   value = {description}
                   onChange = {handleDescriptionChange}
                   fullWidth = {true}
                   required
                   /><br/>
                  <TextField 
                   id="standard-basic" 
                   label="Manufacturer" 
                   value = {manufacturer}
                   onChange = {handleManufacturerChange}
                   fullWidth = {true}
                   /><br/>
                   <TextField 
                   id="standard-basic" 
                   label="Product Name" 
                   value = {productName}
                   onChange = {handleProductNameChange}
                   fullWidth = {true}
                   /><br/>
                   <TextField 
                   id="standard-basic" 
                   label="Latitude" 
                   value = {latitude}
                   onChange = {handleLatitudeChange}
                   fullWidth = {true}
                   required
                   /><br/>
                   <TextField 
                   id="standard-basic" 
                   label="Longitude" 
                   value = {longitude}
                   onChange = {handleLongitudeChange}
                   fullWidth = {true}
                   required
                   /><br/>
                   <FormControl required className={classes.formControl} fullWidth={true}>
                      <InputLabel htmlFor="demo-dialog-native"> Visibility</InputLabel>
                      <Select
                        native
                        value={visibility}
                        onChange={handleVisibilityChange}
                        input={<Input id="demo-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </Select>
                   </FormControl>
                   <TextField 
                   id="standard-basic" 
                   label="Owner" 
                   value = {owner}
                   onChange = {handleOwnerChange}
                   fullWidth = {true}
                   required
                   /><br/>
                   <FormControl className={classes.formControl} fullWidth={true}>
                      <InputLabel htmlFor="demo-dialog-native"> Internet Service Provider</InputLabel>
                      <Select
                        native
                        value={ISP}
                        onChange={handleISPChange}
                        input={<Input id="demo-dialog-native" />}
                      >
                        <option aria-label="None" value="" />
                        <option value="MTN">MTN</option>
                        <option value="Africell">Africell</option>
                        <option value="Airtel">Airtel</option>
                      </Select>
                   </FormControl>
                   <TextField 
                   id="standard-basic" 
                   label="Phone Number" 
                   value = {phone}
                   onChange = {handlePhoneChange}
                   fullWidth = {true}
                   /><br/>
                   
                   </form>
                 
                  </DialogContent> 
          
                 <DialogActions>
                 <Grid container alignItems="center" alignContent="center" justify="center">
                 <Button 
                  variant="contained" 
                  type = "submit"
                  color="primary"              
                  onClick={handleEditSubmit}
                 > Update
                </Button>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button 
                variant="contained" 
                color="primary"              
                type="button"
                onClick = {handleEditClose}
               > Cancel
               </Button>
               </Grid> <br/>
          </DialogActions>
         </Dialog>
         ) : null}

     {sensorOpen? (
       
       <Dialog
           open={sensorOpen}
           onClose={handleSensorClose}
           aria-labelledby="form-dialog-title"
           aria-describedby="form-dialog-description"
           classes={{ paper: classes.paper}}
           //style = {{ minWidth: "500px" }}
         >
           <DialogTitle id="form-dialog-title" style={{alignContent:'center'}}>Add a component</DialogTitle>
           <DialogContent>
                <div>
                  <TextField 
                   id="deviceName" 
                   label="Device Name"
                   value = {deviceName}
                   fullWidth={true}
                   required
                   //onChange={handleDeviceNameChange}
                   /> <br/>

                 <FormControl  required  fullWidth={true}>
                  <InputLabel htmlFor="demo-dialog-native"> Component Name</InputLabel>
                   <Select
                    native
                    value={sensorName}
                    onChange={handleSensorNameChange}
                    input={<Input id="demo-dialog-native" />}
                   >
                        <option aria-label="None" value="" />
                        <option value="Alphasense OPC-N2">Alphasense OPC-N2</option>
                        <option value="pms5003">pms5003</option>
                        <option value="DHT11">DHT11</option>
                        <option value="Lithium Ion 18650">Lithium Ion 18650</option>
                        <option value="Generic">Generic</option>
                        <option value="Purple Air II">Purple Air II</option>
                        <option value="Bosch BME280">Bosch BME280</option>
                      </Select>
                   </FormControl><br/>


                   <FormControl required className={classes.formControl} fullWidth = {true}>
                      <InputLabel htmlFor="demo-dialog-native">Quantity Measured</InputLabel>
                      <Select
                        multiple
                        value={quantityKind}
                        onChange={handleQuantityKindChange}
                        input={<Input />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        <option aria-label="None" value="" />
                        {quantityOptions.map((quantity) => (
                          <MenuItem key={quantity} value={quantity}>
                            <Checkbox checked={quantityKind.indexOf(quantity) > -1} />
                            <ListItemText primary={quantity} />
                            </MenuItem>
                          ))}
                      </Select>
                  </FormControl><br/>
                 </div>
                 
                  </DialogContent> 
          
                 <DialogActions>
                 <Grid container alignItems="center" alignContent="center" justify="center">
                 <Button 
                  variant="contained" 
                  color="primary"              
                  onClick={handleSensorSubmit}
                 > Add
                </Button>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button 
                variant="contained" 
                color="primary"              
                onClick = {handleSensorClose}
               > Cancel
               </Button>
               </Grid>
           </DialogActions>
              
         </Dialog>
         ) : null}
    </div>
    
  );
};

DevicesTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default DevicesTable;
