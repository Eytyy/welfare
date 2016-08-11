// welfare.util = (() => {
//   const getTemplate = url => {
//     // Construct Promise
//     const tpl = new Promise((resolve, reject) => {
//       // AJAX request
//       const req = new XMLHttpRequest();
//       req.open('GET', url);
//
//       req.onload = () => {
//         if (req.status === 200) {
//           // Resolve the promise with the response text
//           resolve(req.response);
//         } else {
//           // Otherwise reject with the status text
//           reject(Error(req.statusText));
//         }
//       };
//
//       // Network errors
//       req.onerror = () => {
//         reject(Error('Network Error'));
//       };
//
//       // Make the request
//       req.send();
//     });
//     // Return promise
//     return tpl;
//   };
//
//   return {
//     getTemplate,
//   };
// })();
