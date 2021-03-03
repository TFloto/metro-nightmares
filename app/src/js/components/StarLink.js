import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { getPartsFromViewId, getViewPath } from '../util.js';

export const StarLink = ({ viewId, database, isFeature, lightMode }) => {
  const [userDocData, setUserDocData] = useState();
  const [systemDocData, setSystemDocData] = useState();
  const [uidForView, setUidForView] = useState();
  const [sysIdForView, setSysIdForView] = useState();

  useEffect(() => {
    if (viewId) {
      const { userId, systemId } = getPartsFromViewId(viewId);

      const userDocString = `users/${userId}`;
      let userDoc = database.doc(userDocString);
      userDoc.get().then((doc) => {
        if (doc) {
          setUserDocData(doc.data());
        }
      }).catch((error) => {
        console.log('Unexpected Error:', error);
      });

      const systemDocString = `${userDocString}/systems/${systemId}`;
      let systemDoc = database.doc(systemDocString);
      systemDoc.get().then((doc) => {
        if (doc) {
          setSystemDocData(doc.data());
        }
      }).catch((error) => {
        console.log('Unexpected Error:', error);
      });

      setUidForView(userId)
      setSysIdForView(systemId)
    }
  }, []);

  if (systemDocData && systemDocData.map) {
    const ownerElem = userDocData ? (
      <div className="StarLink-owner">
        by {userDocData.displayName ? userDocData.displayName : 'Anonymous'}
      </div>
    ) : null;
    return (
      <Link className="StarLink StarLink--ready ViewLink" key={viewId} to={getViewPath(uidForView, sysIdForView)}>
        <div className="StarLink-title">
          {systemDocData.map.title ? systemDocData.map.title : 'Untitled'}
        </div>
        {ownerElem}
      </Link>
    );
  }

  return (
    <div className="StarLink StarLink--loading">
    </div>
  );
}
