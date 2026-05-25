export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
export const removeToken = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); };
export const setUser = (user: any) => localStorage.setItem("user", JSON.stringify(user));
export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const isAuthenticated = () => !!getToken();
export const isCompany = () => getUser()?.role === "company";
export const isCandidate = () => getUser()?.role === "candidate";
export const isAdmin = () => getUser()?.role === "admin";