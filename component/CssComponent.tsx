import { alpha, styled } from '@mui/material/styles';
import {
  TextField,
  Select,
  OutlinedInput
} from '@mui/material'
export const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#4D9623',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ACACAC',
    },
    '&:hover fieldset': {
      borderColor: '#ACACAC',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4D9623',
    },
  },
});

export const CssOutlinedInput = styled(OutlinedInput)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#4D9623',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ACACAC',
    },
    '&:hover fieldset': {
      borderColor: '#ACACAC',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4D9623',
    },
  },
});



const CssSelect = styled(Select)({
  '& label.Mui-focused': {
    color: '#4D9623',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#4D9623',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#4D9623',
    },
    '&:hover fieldset': {
      borderColor: '#ACACAC',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4D9623',
    },
  },
});
