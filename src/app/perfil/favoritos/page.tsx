import { options } from '@/app/api/auth/[...nextauth]/options';
import FavoritesComp from '@/components/user/profile/FavoritesComp';
import { getServerSession } from 'next-auth';
import React from 'react';

const FavoritesPage = async () => {
  const session = await getServerSession(options);
  return (
    <div>
      <FavoritesComp session={session} />
    </div>
  );
};

export default FavoritesPage;
