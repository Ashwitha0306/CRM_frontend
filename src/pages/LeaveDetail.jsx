import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {  LoadingOutlined } from '@ant-design/icons';
const LeaveDetail = () => {
  const { leaveId } = useParams();
  const navigate = useNavigate();
  const employeeId = localStorage.getItem('employeeId');

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  const fetchLeave = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/leave/leaveRequest/${leaveId}/`);
      setLeave(res.data);
    } catch (err) {
      console.error('❌ Error fetching leave detail:', err);
    } finally {
      setLoading(false);
    }
  }, [leaveId]);

  useEffect(() => {
    if (leaveId) fetchLeave();
  }, [leaveId, fetchLeave]);

  const handleAddOrUpdateComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return alert('Comment cannot be empty');

    try {
      if (editingCommentId) {
        await axiosInstance.patch(`/leave/leaveCommen/${editingCommentId}/`, { comment: commentText });
        alert('✅ Comment updated!');
      } else {
        await axiosInstance.post(`/leave/leaveRequest/${leaveId}/add_comment/`, {
          employee: employeeId,
          comment: commentText,
        });
        alert('✅ Comment added!');
      }
      setCommentText('');
      setEditingCommentId(null);
      fetchLeave();
    } catch (err) {
      console.error('❌ Error saving comment:', err);
      alert('Failed to submit comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/leave/leaveCommen/${commentId}/`);
      alert('🗑️ Comment deleted!');
      fetchLeave();
    } catch (err) {
      console.error('❌ Error deleting comment:', err);
      alert('Failed to delete comment.');
    }
  };

if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <LoadingOutlined className="text-4xl text-blue-600 dark:text-blue-400" />
        </motion.div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading your Leave Detail...
        </p>
      </div>
    );
  }

  if (!leave)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Leave Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The requested leave details could not be loaded. Please check the ID and try again.
          </p>
          <button
            onClick={() => navigate('/leave')}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Dashboard
          </button>
        </div>
      </div>
    );

  const emp = leave.employee;
  const statusColors = {
    APPROVED: { bg: 'bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10', text: 'text-green-800 dark:text-green-200' },
    REJECTED: { bg: 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10', text: 'text-red-800 dark:text-red-200' },
    PENDING: { bg: 'bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10', text: 'text-amber-800 dark:text-amber-200' },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="animate-fadeIn">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Leave Request Details
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              ID: {leaveId} • Submitted on {new Date(leave.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => navigate('/leave')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow transition-all transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Leave Detail Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-6">
                <div className="animate-slideInLeft">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Employee</label>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-teal-400 to-teal-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                      {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{emp.first_name} {emp.last_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {emp.employee_id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="animate-slideInLeft delay-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Leave Type</label>
                  <p className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">{leave.leave_type?.name || leave.leave_type_name || '—'}</span>
                  </p>
                </div>
                
                <div className="animate-slideInLeft delay-200">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Reason</label>
                  <p className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    {leave.reason || '—'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 animate-slideInRight">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                    <p className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{leave.start_date}</span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                    <p className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{leave.end_date}</span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Total Days</label>
                    <p className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{leave.number_of_days} days</span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Half Day</label>
                    <p className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      {leave.half_day ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Yes ({leave.half_day_type})</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-medium">No</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="animate-slideInRight delay-100">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Status</label>
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg ${statusColors[leave.status].bg} ${statusColors[leave.status].text} font-medium shadow-sm`}>
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${leave.status === 'APPROVED' ? 'bg-green-500' : leave.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                    {leave.status}
                  </div>
                  
                  {leave.status === 'APPROVED' && (
                    <div className="mt-4 space-y-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Approved by: <span className="font-medium">{leave.approved_by_name || '—'}</span></span>
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Approved at: <span className="font-medium">{leave.approved_at || '—'}</span></span>
                      </p>
                    </div>
                  )}
                  
                  {leave.status === 'REJECTED' && leave.rejection_reason && (
                    <div className="mt-4">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Rejection Reason</label>
                      <p className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800">
                        {leave.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-6">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-300 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Comments
            </h3>
            
            {leave.comments?.length === 0 ? (
              <div className="text-center py-8 animate-fadeIn">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to add one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leave.comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-4 rounded-lg transition-all duration-300 hover:shadow-sm ${
                      String(comment.employee) === String(employeeId) 
                        ? 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 border border-teal-100 dark:border-teal-800 ml-8' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/10 border border-gray-200 dark:border-gray-600'
                    } animate-commentIn`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shadow-sm ${
                          String(comment.employee) === String(employeeId)
                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 text-white'
                        }`}>
                          {comment.employee?.first_name?.charAt(0)}{comment.employee?.last_name?.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            String(comment.employee) === String(employeeId) 
                              ? 'text-teal-700 dark:text-teal-200' 
                              : 'text-gray-800 dark:text-white'
                          }`}>
                            {comment.employee?.first_name} {comment.employee?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {String(comment.employee) === String(employeeId) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setCommentText(comment.comment);
                            }}
                            className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            title="Edit comment"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete comment"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pl-11">
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddOrUpdateComment} className="mt-8 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {editingCommentId ? 'Edit Comment' : 'Add a Comment'}
              </label>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                    {localStorage.getItem('userInitials') || 'U'}
                  </div>
                </div>
                <div className="flex-grow">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    placeholder="Write your comment here..."
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-all duration-300 focus:shadow-sm"
                    required
                  />
                  <div className="flex flex-wrap gap-3 mt-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg shadow transition-all transform hover:scale-[1.02] flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingCommentId ? "M5 13l4 4L19 7" : "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"} />
                      </svg>
                      {editingCommentId ? 'Update Comment' : 'Post Comment'}
                    </button>
                    {editingCommentId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setCommentText('');
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes commentIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
        }
        .animate-commentIn {
          animation: commentIn 0.3s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default LeaveDetail;