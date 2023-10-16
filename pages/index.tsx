import * as React from 'react';
import useStorage from '@/store/Web3Provider/storage'
import Web3Provider from '@/store/Web3Provider';
//config
import config from '@/config'
import { useTest } from '@/hooks/useTest';
//components
import { Box, Button } from '@mui/material';
import Home from './Home';
export interface IAppProps {
}

export default function App(props: IAppProps) {
  return (
        <Home></Home>
  );
}
