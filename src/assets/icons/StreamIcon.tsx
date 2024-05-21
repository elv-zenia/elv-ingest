import {IconProps} from "components/components";

const StreamIcon = ({className}: IconProps) => {
  return (
    <svg className={className} width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.3063 6.0624C17.7747 7.55619 18.5962 9.56777 18.5935 11.6624C18.5948 12.7118 18.389 13.7512 17.9879 14.721C17.5868 15.6907 16.9982 16.5718 16.2559 17.3136M4.99351 17.376C4.23249 16.6319 3.62809 15.7431 3.21591 14.7618C2.80373 13.7805 2.59211 12.7267 2.59351 11.6624C2.59217 10.6103 2.79901 9.56832 3.20213 8.59651C3.60524 7.62469 4.19666 6.74225 4.94231 6M14.0215 8.4976C14.8695 9.3096 15.3935 10.4216 15.3935 11.648C15.3935 12.8896 14.8575 14.0136 13.9911 14.8272M7.23351 14.8624C6.34551 14.0456 5.79351 12.9072 5.79351 11.648C5.79351 10.404 6.33191 9.2768 7.20311 8.4624"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10.5" cy="11.5" r="1.4" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
};

export default StreamIcon;
