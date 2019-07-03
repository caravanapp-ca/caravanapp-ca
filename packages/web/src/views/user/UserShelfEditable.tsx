import React from 'react';
import {
  User,
  UserShelfType,
  EditableUserField,
} from '@caravan/buddy-reading-types';
import BookSearch from '../books/BookSearch';
import BookList from '../club/shelf-view/BookList';

interface UserShelfEditableProps {
  user: User;
  shelf: UserShelfType;
  isEditing: boolean;
  onEdit: (field: EditableUserField, newValue: any) => void;
}

export default function UserShelfEditable(props: UserShelfEditableProps) {
  const { user, shelf, isEditing, onEdit } = props;
  return (
    <div>
      <BookSearch />
      <BookList />
    </div>
  );
}
