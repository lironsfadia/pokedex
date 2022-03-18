import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

function AlignItemsList({ data, theme }) {
  const listItems =  data ? data.map(dataItem => 
                      <Fragment>
                        <ListItem alignItems="flex-start" key={`key-${dataItem.number}`}>
                          <ListItemAvatar>
                            <img alt="po"
                                 loading="lazy"
                                 src={`https://img.pokemondb.net/artwork/${dataItem.name.toLowerCase()}.jpg`}
                                 width="30px"
                                 height="30px" />
                          </ListItemAvatar>
                          <ListItemText
                            style={{color: theme.text}}
                            primary={<b>{dataItem.name}</b>}
                            secondary={
                                <Typography
                                  component="div"
                                  variant="body2"
                                  sx={{ display: 'inline', color: theme.text }}
                                  color="text.primary"
                                >
                                {Object.entries(dataItem).filter(([key, value]) => key !== 'name')
                                      .map(([key, value]) => {
                                      return (<div><b>{`${key.substring(0,1).toUpperCase()}${key.substring(1)}`}</b> : {value}</div>);
                                }) }
                              </Typography>
                            }
                          />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                          </Fragment>) : null;
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: theme.background, color: theme.foreground, color: theme.text }}>
      <Card raised style={{backgroundColor: theme.background}}>{listItems}</Card>
    </List>
  );
}

AlignItemsList.propTypes = {
  data: PropTypes.array,
  theme: PropTypes.object,
};

export default AlignItemsList;