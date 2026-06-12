import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../redux/reducer/userSlice";

const getStoredRedirect = () => {
  const fallback = "/";
  const stored = localStorage.getItem("googleOAuthRedirectTo") || fallback;
  localStorage.removeItem("googleOAuthRedirectTo");

  return stored.startsWith("/") ? stored : fallback;
};

const GoogleOAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    dispatch(getMe())
      .unwrap()
      .then((payload) => {
        if (!isMounted) return;

        const user = payload?.user;
        const redirectTo = getStoredRedirect();

        if (user?.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        navigate(redirectTo, { replace: true });
      })
      .catch(() => {
        if (isMounted) navigate("/login", { replace: true });
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-2xl bg-white px-8 py-7 text-center shadow-lg">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
        <p className="text-sm font-medium text-gray-700">
          Finishing Google sign in...
        </p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
