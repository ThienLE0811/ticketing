// @ts-ignore

// export async function login(body: API.LoginReqParams, options?: { [key: string]: any }) {
//   const { username, password } = body;
//   console.log(process.env);

//   return request<API.LoginRes>(TICKETING_BASE_URL, {
//     method: 'POST',
//     data: {
//       header: HEADER_RAW_REQ_SB,
//       body: {
//         command: 'GET_TRANSACTION',
//         transaction: {
//           authenType: 'get_token',
//           userName: username,
//           passWord: password,
//         },
//       },
//     },
//     ...(options || {}),
//   });
// }
