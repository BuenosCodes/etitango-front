import { Signup } from '../shared/signup';
import React from 'react';

export function ReceiptDisplay(props: { signup: Signup }) {
  return (
    <>
      {props.signup?.receipt &&
        (props.signup.receipt.split('?')[0].endsWith('.pdf') ? (
          // Render PDF using <object> or <iframe>
          <object
            data={props.signup.receipt}
            type="application/pdf"
            // width="50%"
            // height="600px" // Adjust height as needed
            style={{ maxHeight: '100vh', maxWidth: '100%' }}
          >
            <p>
              Your browser does not support PDFs.{' '}
              <a href={props.signup.receipt}>Download the PDF</a>.
            </p>
          </object>
        ) : (
          // Render image
          <img
            src={props.signup.receipt}
            alt="Receipt"
            style={{ maxWidth: '50%', height: 'auto' }}
          />
        ))}
    </>
  );
}
