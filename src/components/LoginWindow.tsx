

import { styled } from '@mui/material/styles';
import { TextField, Button, Paper, IconButton, InputAdornment, OutlinedInput, PaperProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react'


export interface LoginWindowProps extends PaperProps{
  username: string,
  password: string,
  onLogin?(username: string,password: string) : boolean
}

const LoginPaper = styled(Paper)`
  padding: 2em;
  display: flex;
  width: 30em;
  flex-direction: column;
  flex-basis: max-content;
  gap: 2em;
  margin: 0 auto;
  margin-top: 10%;
`

export default function LoginWindow({onLogin, ...otherProps}) {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  
  const [showPassword, setShowPassword] = useState(false)
  
  const [enableLoginBtn, setEnableLoginBtn] = useState(false)

  const [authenticationError, setAuthenticationError] = useState(false)

  const onUsernameChange = (e: any) => setUsername(e.target.value); 
  const onPasswordChange = (e: any) => setPassword(e.target.value);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect( () => {
    setEnableLoginBtn(username && username.length > 0 && password && password.length > 0)
    setAuthenticationError(authenticationError && enableLoginBtn);
  }, [username,password])

  const handleBtnClick = () => {
    if ( onLogin !== undefined && !onLogin(username,password) ) {
      setPassword('')
      setAuthenticationError(true)
      
    }
  }


  return (
    <LoginPaper {...otherProps} style={ (authenticationError) ? {
        animation: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
        perspective: "1000px"} : {}}>
      <TextField key="username" label="Username" variant="outlined" value={username}  onChange={onUsernameChange}/>
      <TextField key="password" label="Password" variant="outlined" value={password}  onChange={onPasswordChange}
        type={showPassword ? 'text' : 'password'}
        InputProps={{endAdornment: 
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }}/>     

      {/* <TextField id="username" label="Username" variant="outlined" value={username} onChange={onUsernameChange}/>
      <TextField id="password" label="Password" variant="outlined" value={password} onChange={onPasswordChange}/> */}
      <Button onClick={handleBtnClick} variant="contained" disabled={!enableLoginBtn}>Login</Button>

      <style jsx>{`

        .authenticationError {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  
        }
        
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

      `}</style>
    </LoginPaper>
  )

}