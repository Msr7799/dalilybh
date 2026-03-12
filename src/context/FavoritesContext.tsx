"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  onValue,
  ref,
  remove,
  set,
  type DatabaseReference,
} from "firebase/database";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface FavoritesContextValue {
  favorites: Set<string>;
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (placeId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const LOCAL_KEY = "dalily_favorites_v1";

function loadLocalFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function saveLocalFavorites(favs: Set<string>) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(favs)));
  } catch {
    // ignore
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      const local = loadLocalFavorites();
      setFavorites(local);
      return;
    }

    const r: DatabaseReference = ref(db, `users/${user.uid}/favorites`);
    const unsub = onValue(r, (snap) => {
      const v = snap.val();
      if (!v || typeof v !== "object") {
        setFavorites(new Set());
        return;
      }
      const ids = Object.keys(v).filter((k) => !!v[k]);
      setFavorites(new Set(ids));
    });

    return () => unsub();
  }, [user]);

  const isFavorite = useCallback(
    (placeId: string) => favorites.has(placeId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (placeId: string) => {
      const next = new Set(favorites);
      const removing = next.has(placeId);
      if (removing) next.delete(placeId);
      else next.add(placeId);

      setFavorites(next);

      if (!user) {
        saveLocalFavorites(next);
        return;
      }

      const itemRef = ref(db, `users/${user.uid}/favorites/${placeId}`);
      if (removing) await remove(itemRef);
      else await set(itemRef, true);
    },
    [favorites, user],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
