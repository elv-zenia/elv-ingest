const CircleAlertIcon = ({className, color}: IconProps) => {
  return (
    <svg className={className} color={color} width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.875 7C0.875 7.73869 1.02049 8.47014 1.30318 9.15259C1.58586 9.83505 2.00019 10.4551 2.52252 10.9775C3.04485 11.4998 3.66495 11.9141 4.34741 12.1968C5.02986 12.4795 5.76131 12.625 6.5 12.625C7.23869 12.625 7.97014 12.4795 8.65259 12.1968C9.33505 11.9141 9.95515 11.4998 10.4775 10.9775C10.9998 10.4551 11.4141 9.83505 11.6968 9.15259C11.9795 8.47014 12.125 7.73869 12.125 7C12.125 5.50816 11.5324 4.07742 10.4775 3.02252C9.42258 1.96763 7.99184 1.375 6.5 1.375C5.00816 1.375 3.57742 1.96763 2.52252 3.02252C1.46763 4.07742 0.875 5.50816 0.875 7Z"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 4.5V7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 9.5H6.50625" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

  );
};

export default CircleAlertIcon;
