// General factory for auth server interface

const authApi = (() => {
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
  };

  const checkPropertyUnique = async (value: string, type: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/users/availability?property=${type}&value=${value}`,
    );
    const data = await res.json();
    if (data.status === "success") {
      return true;
    } else {
      return false;
    }
  };

  return { googleAuth, checkPropertyUnique };
})();

export { authApi };
