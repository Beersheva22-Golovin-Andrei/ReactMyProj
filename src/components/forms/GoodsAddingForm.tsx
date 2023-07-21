import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, MenuItem, Select, SelectChangeEvent, Button, Typography } from '@mui/material';

import { StatusType } from '../../model/StatusType';
import { useRef, useState } from 'react';

import Alert from '../common/Alert';
import { MuiFileInput } from 'mui-file-input';
import { storageService } from '../../config/service-config';
import { getRandomInt } from '../../util/random';
import { StorageReference } from 'firebase/storage';
import Product from '../../model/Product';


type Params = {
  submitFn: (prod: Product) => Promise<Product | null>;
  product?: Product;
};

const GoodsAddingForm: React.FC<Params> = ({ submitFn, product }) => {

  const [statusResult, setStatus] = React.useState<StatusType>();
  const [message, setMessage] = React.useState<string>();
  const inputElementRef = useRef<any>(null);
  const filePath = useRef<any>(product ? product.imageLink : null);

  function convertToString(str: string | null): number {
    let res: number = 0;
    if (str) {
      res = +str;
    }
    return res;
  }

  const handleSubmit: any = async (event: React.FormEvent<HTMLFormElement>) => {

    inputElementRef.current = event.target as any
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name: string = data.get('name') as string;
    const avalability: number = convertToString(data.get('avalability') as string | null);
    const description: string = data.get('descript') as string;
    const notice: string = data.get('notice') as string;
    const price: number = convertToString(data.get('price') as string | null);
    const imageLink: string = filePath.current;
    let newProd: Product = product ? { id: product.id, name, avalability, description, notice, price, imageLink } : { name, avalability, description, notice, price, imageLink }
    const res = await submitFn(newProd);
    if (res == null) {
      setStatus("error")
      setMessage("Item can't be added or update!")
    } else {
      setStatus("success");
      setMessage(`Done!`)
    }
    inputElementRef.current.reset();
  };

  const handleChange = async (file: File | null) => {
    if (file != null) {
      const imgRef: StorageReference = await storageService.uploadImg(file, getRandomInt(100000, 999999));
      const linkOnImg = await storageService.getImg(undefined, imgRef);
      filePath.current = linkOnImg;
    }
  }

  return <Typography>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div>
        <TextField
          required
          id="name-fieled"
          label="Name"
          name="name"
          type='text'
          helperText="enter name of product"
          defaultValue={product?.name || ''}
        />
        <TextField
          required
          id="stock-fieled"
          label="Stock"
          name="avalability"
          type='number'
          helperText="amount"
          inputProps={{ min: '1' }}
          defaultValue={product?.avalability || 0}
        />
        <TextField
          required
          id="price-fieled"
          label="Price"
          name="price"
          type='number'
          helperText="Price"
          inputProps={{ min: '1' }}
          defaultValue={product?.price || 0}
        />
        <TextField
          required
          id="desc-fieled"
          label="Description"
          name="descript"
          type='text'
          helperText="Add description"
          defaultValue={product?.description || ''}
        />
        <TextField
          required
          id="notice-fieled"
          label="Nitice"
          name="notice"
          type='text'
          helperText="Notices"
          defaultValue={product?.notice || ''}
        />

        <MuiFileInput onChange={handleChange} name='Image' label="Image" helperText="Add image" />
      </div>
      <Button type="submit" variant="contained">submit</Button>
    </Box>
    <Alert status={statusResult as StatusType} message={message as string} />
  </Typography>
}

export default GoodsAddingForm;