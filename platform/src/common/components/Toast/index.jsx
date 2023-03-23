const Toast = ({ message, type }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const textColor = type === 'success' ? 'text-black-600' : 'text-white';

  const containerStyles = `flex fixed bottom-5 right-6 z-50 p-4 w-80 text-sm ${colors[type]} ${textColor} rounded-md shadow-lg transition-opacity`;

  return (
    <div className={containerStyles}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
