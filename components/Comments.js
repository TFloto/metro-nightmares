import React, { useState, useContext, useCallback, forwardRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import TextareaAutosize from 'react-textarea-autosize';
import ReactGA from 'react-ga4';

import { FirebaseContext } from '/util/firebase.js';

import { Comment } from '/components/Comment.js';

export const Comments = forwardRef(({ commentData,
                                      systemId,
                                      ownerUid,
                                      commentsCount,
                                      commentsLocked,
                                      onToggleShowAuth,
                                      onToggleCommentsLocked },
                                    textareaRef) => {
  const firebaseContext = useContext(FirebaseContext);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [input, setInput] = useState('');

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleAddComment = async () => {
    // Change the text of the comment button to "Nope"
    setButtonClicked(true);

    // Calculate a random position for the button
    let randomX = Math.floor(Math.random() * (window.innerWidth - 100)); // Adjust 100 to fit your button's width
    let randomY = Math.floor(Math.random() * (window.innerHeight - 50)); // Adjust 50 to fit your button's height

    // Ensure the button stays within the window boundaries
    randomX = Math.max(randomX, 0);
    randomY = Math.max(randomY, 0);

    // Get the comment button element
    const commentButton = document.querySelector('.Comments-submit');

    // Set the new position of the button
    commentButton.style.position = 'fixed';
    commentButton.style.zIndex = '9999'; // Set a high z-index to ensure it renders on top
    commentButton.style.top = `${randomY}px`;
    commentButton.style.left = `${randomX}px`;

    ReactGA.event({
      category: 'System',
      action: 'Add Comment'
    });
  };

  const getHeadingText = () => {
    const numComments = Math.max((commentData.comments || []).length, commentsCount);
    if (!commentData.commentsLoaded || !numComments) {
      return 'Comments';
    } else if (numComments === 1) {
      return '1 Comment';
    } else {
      return `${numComments} Comments`;
    }
  };

  const renderLockButton = () => {
    return (
      <button className="Comments-lockButton" onClick={onToggleCommentsLocked}>
        {commentsLocked ?
          <i className="fa-solid fa-lock" data-tooltip-content="Comments locked; tap to unlock comments"></i> :
          <i className="fa-solid fa-lock-open" data-tooltip-content="Comments unlocked; tap to lock comments"></i>}
      </button>
    );
  };

  const renderLockedMessage = () => {
    return <div className="Comments-locked">
      Comments are locked.
    </div>;
  };

  return (
    <div className="Comments SystemSection">
      <div className="Comments-top">
        <h2 className="Comments-heading">
          {getHeadingText()}
        </h2>

        {!firebaseContext.authStateLoading && firebaseContext.user && firebaseContext.user.uid === ownerUid && renderLockButton()}
      </div>

      {commentsLocked ? renderLockedMessage() : (
        <form className="Comments-new" onSubmit={(e) => { e.preventDefault(); handleAddComment(); }}>
          <TextareaAutosize className="Comments-textarea" ref={textareaRef}
                            value={input} placeholder="Add a comment..."
                            onChange={handleChange} />
          <button
            className={`Comments-submit Button--primary ${buttonClicked ? 'clicked' : ''}`}
            type="submit"
            disabled={input.trim() === ''}
          >
            {buttonClicked ? 'Nope' : 'Comment'}
          </button>
        </form>
      )}

      {commentData.commentsLoaded && (
        <ol className="Comments-list">
          {(commentData.comments || []).map(comment => (
            <li className="Comments-item" key={comment.id}>
              <Comment
                comment={comment}
                isCurrentUser={firebaseContext.user && firebaseContext.user.uid === comment.userId}
                isOwner={ownerUid === comment.userId}
              />
            </li>
          ))}
        </ol>
      )}

      {commentData.commentsLoaded && !commentData.showAllComments && (
        <button
          className="Comments-showAll"
          onClick={() => {
            commentData.setShowAllComments(true);
            ReactGA.event({
              category: 'System',
              action: 'Show All Comments'
            });
          }}
        >
          <i className="fas fa-chevron-circle-down"></i>
          <span className="Comments-allText">Show all comments</span>
        </button>
      )}
    </div>
  );
});
