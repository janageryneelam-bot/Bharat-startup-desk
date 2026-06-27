import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("bsd_profile");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (profile) localStorage.setItem("bsd_profile", JSON.stringify(profile));
    else localStorage.removeItem("bsd_profile");
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
