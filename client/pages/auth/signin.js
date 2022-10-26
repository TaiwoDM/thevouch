import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    // <form onSubmit={onSubmit}>
    //   <h1>Sign In</h1>
    //   <div className="form-group">
    //     <label>Email Address</label>
    //     <input
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       className="form-control"
    //     />
    //   </div>
    //   <div className="form-group">
    //     <label>Password</label>
    //     <input
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       type="password"
    //       className="form-control"
    //     />
    //   </div>
    //   {errors}
    //   <button className="btn btn-primary">Sign In</button>
    // </form>

    // <div class="d-flex align-items-center">
    <div className="row" style={{ height: '60vh' }}>
      <form onSubmit={onSubmit} className="row col-10 col-lg-6  g-3 m-auto ">
        <h1 className="h3 mb-3 fw-normal">Sign in</h1>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label for="floatingPassword">Password</label>
        </div>

        {errors}
        <button className="w-25 btn btn-md btn-secondary" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};
