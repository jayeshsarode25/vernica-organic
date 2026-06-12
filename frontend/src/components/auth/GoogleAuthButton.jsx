import { getGoogleOAuthUrl } from "../../redux/services/auth.services";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.827 32.657 29.285 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.053 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.053 6.053 29.277 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.178 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.267 0-9.799-3.326-11.289-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.062 3.118-3.077 5.583-5.884 7.161l6.19 5.238C39.99 36.55 44 30.789 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const GoogleAuthButton = ({ label = "Continue with Google", redirectTo = "/" }) => {
  const handleGoogleAuth = () => {
    localStorage.setItem("googleOAuthRedirectTo", redirectTo);
    window.location.assign(getGoogleOAuthUrl());
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition mb-6"
    >
      <GoogleIcon />
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default GoogleAuthButton;
