import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import React from "react";
import Order from "../../model/Order";


type Params = { items: string[]; nameSelector: string, selctorId: string, first: string, submitFn(status:string, order:Order):void, order:Order}
const Selector: React.FC<Params> = ({ items, nameSelector, selctorId, first, submitFn, order}) => {
  const [selected, setSelected] = React.useState<string>(first);

  const handleChange = (event: SelectChangeEvent) => {
    const resSelect: string = event.target.value;
    submitFn(resSelect, order);
    setSelected(resSelect);
    
  };

  return <Typography>
    <FormControl sx={{ m: 1, minWidth: 150 }}>
      <InputLabel id="demo-simple-select-autowidth-label">{nameSelector}</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id={selctorId}
        value={selected}
        onChange={handleChange}
        autoWidth
        label={nameSelector}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {items.map(item => <MenuItem value={item}>{item}</MenuItem>)}
      </Select>
    </FormControl>

  </Typography>
}

export default Selector;

