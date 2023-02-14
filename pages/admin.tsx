import React from 'react';
import Head from "next/head";
import { useRouter } from "next/router";
import BarStyle from '../styles/Bar';
import Style from '../styles/Admin';
import { Typography, IconButton, AppBar, Toolbar, Tabs, Tab, Button, Collapse, CardContent, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Divider, Avatar, TableHead, TableCell, TableRow, Table, TableBody, Checkbox, Paper, rgbToHex, hexToRgb, Box } from '@material-ui/core';
import { useGoogleProfile, getTestProfile } from "../lib/useGoogleProfile";
import { useAPI, API as WaiterAPI, Product, Error, isError, Order } from "../lib/API";
import { useSnackbar } from 'notistack';
import { TabPanel } from '../components/TabPanel';
import { CustomTable } from '../components/CustomTable';
import { CustomTableHead } from '../components/CustomTableHead';
import MenuTableStyle from '../styles/MenuTable';
import OrdersTableStyle from '../styles/OrdersTable';
import { ExpandButton } from '../components/ExpandButton';
import { totalItems, totalPrice } from '../lib/Miscellaneus';
import { CustomToolBar } from '../components/CustomToolBar';
import FilterListIcon from '@material-ui/icons/FilterList';
import DeleteIcon from '@material-ui/icons/Delete';
import toolBarStyle from '../styles/ToolBar';
import theme from '../styles/Theme';
import { ArgumentAxis, ValueAxis, Chart, LineSeries, BarSeries, Title, Legend, Tooltip} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker, HoverState, Palette } from '@devexpress/dx-react-chart';
import { AddProduct } from '../components/AddProduct';
import AddIcon from '@material-ui/icons/Add';
import DetailsTableStyle from '../styles/DetailsTable';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import clsx from 'clsx';
import { Ingredients } from '../components/Ingredients';

export default function Page() {
  const classes = Style();
  const barClasses = BarStyle();
  const ordersTableClasses = MenuTableStyle();
  const menuTableClasses = OrdersTableStyle();
  const toolBarClasses = toolBarStyle();
  const [value, setValue] = React.useState<number>(0);
	const profile = process.env.NODE_ENV === 'production' ? useGoogleProfile() : getTestProfile();
	const [api, setAPI] = React.useState<WaiterAPI | Error>();
  const [menu, setMenu] = React.useState<Product[] | Error>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = React.useState<Order[] | Error>();
  const [id, setId] = React.useState<number>();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [paid, setPaid] = React.useState<number[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
 
  React.useEffect(
			api === undefined ? () => {
				if(typeof profile === 'object'){
					useAPI(profile).then(setAPI);
				} else if(typeof profile === 'string') {
					router.replace("/")
				}
			} : () => {
				if(menu === undefined && !isError(api)){
          api.getMenu().then(setMenu).then(displayError);
          //setInterval would queue the promise without waiting for its completion 
          const routine = async () => {
            await api.getMenu().then(setMenu).then(displayError);
            setTimeout(routine, 5000);
          };
          setTimeout(routine, 5000);
				}
        if (orders === undefined && !isError(api)) {
          api.getAllOrders().then(setOrders).then(displayError);
          //setInterval would queue the promise without waiting for its completion 
          const routine = async () => {
            await api.getAllOrders().then(setOrders).then(displayError);
            setTimeout(routine, 5000);
          };
          setTimeout(routine, 5000);
				}
		}
  );
  
  function displayError<T>(response: T | Error): T | Error {
		if(isError(response)){
			enqueueSnackbar(<Typography>Errore dell'API<Divider />{response.reason} <Divider />{response.message}</Typography>,{
        preventDuplicate: true,
        variant: 'error',
        autoHideDuration: 2000,
      });
		}
		return response;
	}
		
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => setValue(newValue);

  const handleExpandClick = (id: number) => {
    setId(id);
    setExpanded(!expanded);
	};

  const isSelected = (id: number): boolean => {
    return selected.indexOf(id) != -1;
  }

  const isPaid = (id: number): boolean => {
    return paid.indexOf(id) != -1;
  }

  const handleRowClick = (id: number) => {
    if(selected.length < 0){
      setSelected([id]);
    } else if (!isSelected(id)) {
      setSelected(selected.concat(id));
    } else {
      setSelected(selected.filter((selected: number) => {
        return selected != id;
      }));
    }
	};

  const handleOrderRemove = async () => {
    if(api && !isError(api)){
      selected.forEach(async (selected: number) => {
        await api.setOrderAsDone(selected);
      })
      await api.getAllOrders().then(setOrders);
      setSelected([]);
    } else {
      //throw error
    }
  };

  const handleMenuItemRemove = async () => {
    if(api && !isError(api)){
      selected.forEach(async (selected: number) => {
        await api.removeMenuItem(selected);
      })
      await api.getMenu().then(setMenu).then(displayError);
      setSelected([]);
    } else {
      //throw error
    }
  };

  const handleItemPayment = () => {
    selected.forEach((selected: number) => {
      if (paid.length < 0) {
        setPaid([selected]);
      } else if (!isPaid(selected)) {
        setPaid(paid.concat(selected));
      } else {
        setPaid(paid.filter((paid: number) => {
          return paid != selected;
        }));
      }
    })
    setSelected([]);
  };

  const getCharData = (): { "name": string, "amount": number }[] => {
    let result: { "name": string, "amount": number }[] = [];
    let idx: number;
    if (orders && menu && !isError(menu) && !isError(orders)) {
      orders.forEach((order: Order) => {
        order.cart.forEach((item: [number, number]) => {
          if ((idx = result.findIndex((data: { "name": string, "amount": number }) => {
            return data.name == menu[item[0]].name;
          })) != -1) {
            result[idx].amount += item[1];
          } else {
            result.push({"name": menu[item[0]].name, "amount": item[1]});
          }
        })
      });
    }
    return result;
  }

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <Head>
        <title>Amministrazione</title>
      </Head>
      <AppBar position="static" className={barClasses.appBar}>
        <Toolbar>
					<Typography variant="h1" className={barClasses.title}>
            Amministrazione
          </Typography>
          <Tabs value={value} onChange={handleChange} className={barClasses.tabs} variant="scrollable" scrollButtons="auto">
            <Tab label="Ordini"/>
            <Tab label="Menu"/>
          </Tabs>
        </Toolbar>
      </AppBar>
      {
        orders && menu && !isError(orders) && !isError(menu) ?
          <TabPanel value={value} index={0} style={classes.tabPanel}>
            <Paper className={classes.root}>
              <CustomToolBar
                style={clsx("", {
                  [classes.highlight]: selected.length > 0,
                })}
              >
                {
                  selected.length > 0 ?
                    (
                      <React.Fragment>
                        <Typography className={toolBarClasses.title} variant="h4">{selected.length} selezionati</Typography>
                        <IconButton onClick={() => handleItemPayment()}>
                          <MonetizationOnIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOrderRemove()}>
                          <DeleteIcon />
                        </IconButton>
                      </React.Fragment>
                    )
                    :
                    (
                      <React.Fragment>
                        <Typography className={toolBarClasses.title} variant="h2">Ordini</Typography>
                        <IconButton>
                          <FilterListIcon />
                        </IconButton>
                      </React.Fragment>
                    )
                }
              </CustomToolBar>
              <CustomTable
                style={OrdersTableStyle}
                customTableHead={
                  <CustomTableHead columns={["","","Cliente","Turno","Quantità","Prezzo","Pagato"]}></CustomTableHead>
                }
                stickyHeader={true}
              >
                {
                  orders.map((order) => {
                    return (
                      <React.Fragment key={order.id}>
                        <TableRow
                          className={clsx(classes.notPaidHighlight, {
                            [classes.paidHighlight]: isPaid(order.id),
                          })}
                          hover
                          selected={isSelected(order.id)}
                        >
                          <TableCell onClick={() => handleRowClick(order.id)}>
                            <Checkbox
                              checked={isSelected(order.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <ExpandButton expanded={expanded} itemId={order.id} selectedId={id} handleExpandClick={handleExpandClick}></ExpandButton> 
                          </TableCell>
                          <TableCell>{order.owner_name} {order.owner}</TableCell>
                          <TableCell>{order.first_term ? "Primo turno" : "Secondo turno"}</TableCell>
                          <TableCell>{totalItems(order.cart)}</TableCell>
                          <TableCell>{(totalPrice(order.cart, menu) / 100).toFixed(2)}</TableCell>
                          <TableCell>
                              {isPaid(order.id) ? <RadioButtonCheckedIcon/> : <RadioButtonUncheckedIcon/>}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={ordersTableClasses.detailsCell} colSpan={6}>
                            <Collapse in={expanded && order.id == id} timeout="auto" unmountOnExit>
                              <CustomTable
                                style={DetailsTableStyle}
                                customTableHead={
                                  <CustomTableHead columns={["Immagine","Nome","Quantitá","Prezzo","Totale"]}></CustomTableHead>
                                }
                                stickyHeader={false}
                              >
                                {
                                  order.cart.map((item: [number, number]) => {
                                    return (
                                      <TableRow key={`${order.id}_${item[0]}`}>
                                        <TableCell>
                                          <Avatar src={URL.createObjectURL(new Blob([menu[item[0]].image], { type: 'image/png' }))} className={ordersTableClasses.detailsImage}/>
                                        </TableCell>
                                        <TableCell>
                                          {menu[item[0]].name}
                                        </TableCell>
                                        <TableCell>
                                          {item[1]}
                                        </TableCell>
                                        <TableCell>
                                          {(menu[item[0]].price / 100).toFixed(2)}€
                                        </TableCell>
                                        <TableCell>
                                          {(menu[item[0]].price * item[1] / 100).toFixed(2)}€
                                        </TableCell>
                                      </TableRow> 
                                    )
                                  })
                                }
                              </CustomTable>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    )                    
                  })
                }
              </CustomTable>
            </Paper>
            <Paper className={classes.root}>
              <Chart
                data={getCharData()}
                height={window.innerHeight / 2.5} //50vh
              >
                <ArgumentAxis />
                <ValueAxis/>

                <Palette scheme={[theme.palette.secondary.main]} />
                <BarSeries valueField="amount" argumentField="name"/>
                <Title text="Totale ordinazioni" textComponent={(props) => <Title.Text {...props} style={{padding: theme.spacing(1)}} variant="h2"/>}/>
                <EventTracker />
                <HoverState />
                <Tooltip />
                <Animation duration={1000}/>
              </Chart>
            </Paper>
          </TabPanel>
          :
          <LinearProgress color="secondary" />
      }
      {
        menu && !isError(menu) && api && !isError(api) ?
          <TabPanel value={value} index={1} style={classes.tabPanel}>
            <Paper className={classes.root}>
              <CustomToolBar
                style={clsx("", {
                  [classes.highlight]: selected.length > 0,
                })}
              >
                {
                  selected.length > 0 ?
                    (
                      <React.Fragment>
                        <Typography className={toolBarClasses.title} variant="h4">{selected.length} selezionati</Typography>
                        <IconButton onClick={() => handleMenuItemRemove()}>
                          <DeleteIcon />
                        </IconButton>
                      </React.Fragment>
                    )
                    :
                    (
                      <React.Fragment>
                        <Typography className={toolBarClasses.title} variant="h2">Ordini</Typography>
                        <IconButton onClick={handleClickOpen}>
                          <AddIcon/>
                        </IconButton>
                        <AddProduct addMenuItem={api.addMenuItem} open={open} onClose={handleClose}></AddProduct>
                      </React.Fragment>
                    )
                }
              </CustomToolBar>
              <CustomTable
                style={MenuTableStyle}
                customTableHead={
                  <CustomTableHead columns={["","","Immagine","Nome","Tipologia","Prezzo","Quantità massima"]}></CustomTableHead>
                }
                stickyHeader={true}
              >
                {
                  menu.map((product: Product) => {
                    return (
                      <React.Fragment key={product.id}>
                        <TableRow hover>
                          <TableCell onClick={() => handleRowClick(product.id)}>
                            <Checkbox
                              checked={isSelected(product.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <ExpandButton expanded={expanded} itemId={product.id} selectedId={id} handleExpandClick={handleExpandClick}></ExpandButton> 
                          </TableCell>
                          <TableCell>
                            <Avatar src={URL.createObjectURL(new Blob([product.image], { type: 'image/png' }))} className={menuTableClasses.detailsImage}/>
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.kind}</TableCell>
                          <TableCell>{(product.price / 100).toFixed(2)}€</TableCell>
                          <TableCell>{product.max_num}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={menuTableClasses.detailsCell} colSpan={6}>
                            <Collapse in={expanded && product.id == id} timeout="auto" unmountOnExit>
                              {product.ingredients && <Ingredients ingredients={product.ingredients}></Ingredients>}
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    )                    
                  })
                }
              </CustomTable>
            </Paper>
          </TabPanel>
            :
          <LinearProgress color="secondary" />
      }
    </React.Fragment>
  )
}