import { useRef, useState } from 'react';
import './App.css'

type User = {
  name: string,
  token: string
}

function App() {
  const usrRef = useRef<HTMLInputElement>(null);
  const passwdRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [usr, setUsr] = useState<User | undefined>(undefined);

  const onSignUp = async () => {
    const payload = {
      username: usrRef.current!.value,
      password: passwdRef.current!.value
    }
    console.log(payload)

    setIsLoading(true);
    setMsg('');
    try {
      const res = await fetch('http://127.0.0.1:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status !== 200) {
        setMsg(JSON.stringify(await res.json()))
      } else {
        setMsg('Success!')
      }

      const data = await res.json();

      if (data.success) {
        setUsr({
          name: payload.username,
          token: data.token
        });
      }

    } catch (e) {
      setMsg('Signup failed!');
    } finally {
      setIsLoading(false);
    }
  }
  const onSignIn = async () => {
    const payload = {
      username: usrRef.current!.value,
      password: passwdRef.current!.value
    }
    console.log(payload)

    setIsLoading(true);
    setMsg('');
    try {
      const res = await fetch('http://127.0.0.1:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status !== 200) {
        setMsg(JSON.stringify(await res.json()))
        return;
      } else {
        setMsg('Success!')
      }

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setUsr({
          name: payload.username,
          token: data.token
        });
      }

    } catch (e) {
      setMsg('Signup failed!');
    } finally {
      setIsLoading(false);
    }
  }

  const onSignOut = () => {
    setUsr(undefined);
    setMsg('');
  }

  return (
    <>
      {!usr ?
        <main>
          <label htmlFor="username">Username</label>
          <input ref={usrRef} id='username' type='text' />
          <label htmlFor="password">Password</label>
          <input ref={passwdRef} id="password" type="password" />
          {isLoading ? <p>Loading . . .</p>
            :
            <div>
              <button onClick={onSignUp}>Sign Up</button>
              <button onClick={onSignIn}>Sign in</button>
            </div>
          }
          {msg}
        </main>
        :
        <main>
          <h1>Hello, {usr.name}!</h1>
          <p>your token is {usr.token}</p>
          <button onClick={onSignOut}>Sign out</button>
        </main>
        }
    </>
  )
}

export default App
