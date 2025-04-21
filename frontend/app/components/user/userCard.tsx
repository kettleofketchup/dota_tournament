import React, { use, useEffect, useState } from 'react';
import type { User } from '../types';
import axios from "../api/axios"

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<User>({ ...user });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof User, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.pk) return;
    setIsSaving(true);
    try {
      await axios.patch(`/users/${user.pk}/`, form);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      setIsSaving(false);
    }


  };

  useEffect(() => {

  }, [user, isSaving]);
  return (
    <div className="card bg-base-200 shadow-md p-4 w-full max-w-sm">
      <div className="flex items-center gap-4">
        {user.avatar && (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="w-16 h-16 rounded-full border border-primary"
          />
        )}

        <div className="flex-1">
          {editMode ? (
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="input input-bordered w-full"
            />
          ) : (
            <h2 className="card-title text-lg">{user.username}</h2>
          )}
          <div className="flex gap-2 mt-1">
            {user.is_staff && <span className="badge badge-warning">Staff</span>}
            {user.is_superuser && <span className="badge badge-error">Admin</span>}
          </div>
        </div>
        <button
          className="btn btn-sm btn-outline ml-auto"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {editMode ? (
          <>
            <div>
              <label className="font-semibold">MMR:</label>
              <input
                type="number"
                value={form.mmr ?? ''}
                onChange={(e) => handleChange("mmr", parseInt(e.target.value))}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Position:</label>
              <input
                type="text"
                value={form.position ?? ''}
                onChange={(e) => handleChange("position", e.target.value)}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Steam ID:</label>
              <input
                type="number"
                value={form.steamid ?? ''}
                onChange={(e) => handleChange("steamid", parseInt(e.target.value))}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm mt-3"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </>
        ) : (
          <>
            {user.mmr !== undefined && (
              <div>
                <span className="font-semibold">MMR:</span> {user.mmr}
              </div>
            )}
            {user.position && (
              <div>
                <span className="font-semibold">Position:</span> {user.position}
              </div>
            )}
            {user.steamid && (
              <div>
                <span className="font-semibold">Steam ID:</span> {user.steamid}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
