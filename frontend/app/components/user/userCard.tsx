import React, { use, useEffect, useState } from 'react';
import type { User } from './types';
import axios from "../api/axios"
import { useNavigate } from "react-router";

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<User>({ ...user });
  const [isSaving, setIsSaving] = useState(false);
  let navigate = useNavigate();

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

  const avatar = () => {
    return (
        <>
        {user.avatar && (
            <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="w-16 h-16 rounded-full border border-primary"
            />
        )}
            </>
  )}

  const userHeader = () => {
    return (
        <>
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
            </>
  )}


    const editModeView = () => {
    return (

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
  )}

  const viewMode = () => {
    return (<>

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

    </>) }

const goToDotabuff = () => {
    return `https://www.dotabuff.com/players/${user.steamid}`
}
const userDotabuff = () => {

    if (!user.steamid) return <></>;
    return (
        <>

        <a
        className="btn btn-sm btn-outline ml-auto"
        href={goToDotabuff()}>
        <span className="flex items-center">
            <img
            src="https://cdn.brandfetch.io/idKrze_WBi/w/96/h/96/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
            alt="Dotabuff Logo"
            className="w-4 h-4 mr-2"
            />
            Dotabuff Profile
            </span>
      </a>
    </>
    )
}
  return (
    <div className="card bg-base-200 shadow-md p-4 w-full
         max-w-sm hover:bg-violet-900 . focus:outline-2
         hover:shadow-xl/30
         focus:outline-offset-2 focus:outline-violet-500
          focus:outline-offset-2 active:bg-violet-900
        delay-700 duration-900 ease-in-out">
      <div className="flex items-center gap-4">
        {avatar()}
        {userHeader()}

        <button
          className="btn btn-sm btn-outline ml-auto"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {editMode ? editModeView() :viewMode() }
      </div>
      {userDotabuff()}
    </div>
  );
};
