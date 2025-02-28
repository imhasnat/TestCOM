import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import {
  createOrUpdateMultipleWishlist,
  deleteWishlist,
  getWishlistByUserId,
} from "api/wishlist/wishlistApi";

const WishlistContext = createContext();

const getInitialState = () => {
  if (typeof window !== "undefined") {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error("Error parsing wishlist from localStorage:", error);
      return [];
    }
  }
  return [];
};

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(getInitialState);
  const [wishlistID, setWishlistID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const syncInProgress = useRef(false);

  // Clear state when user logs out
  useEffect(() => {
    if (!user) {
      setWishlistItems(getInitialState());
      setWishlistID(null);
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const syncWishlist = async () => {
      if (!user?.id || syncInProgress.current) return;

      syncInProgress.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Fetch wishlist from the database
        const response = await getWishlistByUserId(user.id);
        const dbWishlist = response.data;

        if (response.success) {
          // Get local wishlist from localStorage
          const localWishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

          // Create new items to be added to the database
          const newItems = localWishlist.filter(
            (localItem) =>
              !dbWishlist.some(
                (dbItem) => dbItem.productID === localItem.productID
              )
          );

          if (newItems.length > 0) {
            // Add userId to new items
            const newItemsWithUserId = newItems.map((item) => ({
              ...item,
              userId: user.id,
            }));

            // Create new items in the database
            const createResponse = await createOrUpdateMultipleWishlist(
              user.id,
              newItemsWithUserId
            );

            // Fetch updated wishlist to get the new wishlistItemIDs
            const updatedResponse = await getWishlistByUserId(user.id);
            if (updatedResponse.success) {
              // Update state with the complete database wishlist
              setWishlistItems(updatedResponse.data);
              setWishlistID(updatedResponse.data[0]?.wishlistID);
            }
          } else {
            // If no new items, just use the database wishlist
            setWishlistItems(dbWishlist);
            setWishlistID(dbWishlist[0]?.wishlistID);
          }

          // Clear local storage after successful sync
          localStorage.removeItem("wishlist");
          // toast.success("Wishlist synchronized with database");
        } else {
          // Handle case when no wishlist exists in database
          const localWishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

          if (localWishlist.length > 0) {
            const localWishlistWithUserId = localWishlist.map((item) => ({
              ...item,
              userId: user.id,
            }));

            // Create wishlist in database
            const createResponse = await createOrUpdateMultipleWishlist(
              user.id,
              localWishlistWithUserId
            );

            // Fetch the newly created wishlist to get the wishlistItemIDs
            const newWishlistResponse = await getWishlistByUserId(user.id);
            if (newWishlistResponse.success) {
              setWishlistItems(newWishlistResponse.data);
              setWishlistID(newWishlistResponse.data[0]?.wishlistID);
            }

            localStorage.removeItem("wishlist");
            // toast.success("Wishlist created in database");
          }
        }
      } catch (error) {
        console.error("Error syncing wishlist with database:", error);
        setError(error);
        toast.error("Failed to synchronize wishlist with database");
      } finally {
        setIsLoading(false);
        syncInProgress.current = false;
      }
    };

    syncWishlist();
  }, [user?.id]);

  useEffect(() => {
    if (!mounted) return;

    // Only update localStorage if user is not logged in
    if (!user?.id) {
      try {
        if (wishlistItems.length > 0) {
          localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
        } else {
          localStorage.removeItem("wishlist");
        }
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }
    }
  }, [wishlistItems, user?.id, mounted]);

  const addToWishlist = useCallback(
    async (product) => {
      if (!product?.productID) {
        toast.error("Invalid product");
        return false;
      }

      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item.productID === product.productID
      );

      if (isAlreadyInWishlist) {
        toast.info("Product already in wishlist");
        return false;
      }

      try {
        setIsLoading(true);

        if (user?.id) {
          // For logged-in users: Add to database
          const newItem = {
            productID: product.productID,
            productName: product.productName,
            price: product.price,
            image: product.image,
            quantity: Math.max(1, Math.min(99, product.quantity || 1)),
            userId: user.id,
          };

          // If we don't have a wishlistID, try to get it first
          if (!wishlistID) {
            const wishlistResponse = await getWishlistByUserId(user.id);
            if (wishlistResponse.success && wishlistResponse.data.length > 0) {
              setWishlistID(wishlistResponse.data[0].wishlistID);
              newItem.wishlistID = wishlistResponse.data[0].wishlistID;
            }
          } else {
            newItem.wishlistID = wishlistID;
          }

          // Add to database
          const response = await createOrUpdateMultipleWishlist(user.id, [
            newItem,
          ]);

          if (response.success) {
            // Fetch updated wishlist to get the new item with wishlistItemID
            const updatedWishlistResponse = await getWishlistByUserId(user.id);
            if (updatedWishlistResponse.success) {
              setWishlistItems(updatedWishlistResponse.data);
              // toast.success("Item added to wishlist");
              return true;
            }
          }

          throw new Error("Failed to add item to wishlist");
        } else {
          // For non-logged-in users: Add to local storage
          const newItem = {
            productID: product.productID,
            productName: product.productName,
            price: product.price,
            image: product.image,
            quantity: Math.max(1, Math.min(99, product.quantity || 1)),
          };

          // Update state
          setWishlistItems((prevItems) => [...prevItems, newItem]);

          // Update local storage
          const updatedWishlist = [...wishlistItems, newItem];
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

          // toast.success("Item added to wishlist");
          return true;
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        // toast.error(error.message || "Failed to add item to wishlist");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, wishlistItems, wishlistID]
  );

  const removeFromWishlist = useCallback(
    async (productID) => {
      if (!productID) {
        return false;
      }

      try {
        if (user?.id) {
          // Find the wishlistItemID for the given productID
          const wishlistItem = wishlistItems.find(
            (item) => item.productID === productID
          );

          if (!wishlistItem?.wishlistItemID) {
            console.error("WishlistItemID not found for product:", productID);
            return false;
          }

          // Remove from database using wishlistItemID
          const response = await deleteWishlist(wishlistItem.wishlistItemID);

          if (response.success) {
            // Update UI only if deletion was successful
            setWishlistItems((prevItems) =>
              prevItems.filter((item) => item.productID !== productID)
            );
            return true;
          }

          return false;
        } else {
          // If user is not logged in, remove from local storage
          const updatedWishlist = wishlistItems.filter(
            (item) => item.productID !== productID
          );

          // Update state
          setWishlistItems(updatedWishlist);

          // Update local storage
          if (updatedWishlist.length > 0) {
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          } else {
            localStorage.removeItem("wishlist");
          }

          return true;
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        return false;
      }
    },
    [user?.id, wishlistItems]
  );

  const clearWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setWishlistItems([]);
      if (user?.id) {
        await deleteWishlist(user.id);
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const value = {
    wishlistItems,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist: useCallback(
      (productId) => wishlistItems.some((item) => item.productID === productId),
      [wishlistItems]
    ),
    getWishlistCount: useCallback(() => wishlistItems.length, [wishlistItems]),
    getWishlistItems: useCallback(() => wishlistItems, [wishlistItems]),
  };

  return (
    <WishlistContext.Provider value={value}>
      {mounted ? children : null}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
