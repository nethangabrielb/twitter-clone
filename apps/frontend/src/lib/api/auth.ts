const googleAuth = () => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    `${process.env.NEXT_PUBLIC_API}/api/auth/login/google`,
    "googleAuthPopup",
    `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no`,
  );

  window.addEventListener("message", (event) => {
    if (event.data.success) {
      window.location.href = `/onboarding`;
    } else {
      window.location.href = `/`;
    }
  });
};

export { googleAuth };
