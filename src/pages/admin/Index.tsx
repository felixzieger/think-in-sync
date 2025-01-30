import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AdminHighScoresTable } from "@/components/admin/AdminHighScoresTable";

export const AdminIndex = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (error || !isAdmin) {
        console.error("Not an admin or error checking admin status:", error);
        navigate("/admin/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AdminHighScoresTable />
    </div>
  );
};