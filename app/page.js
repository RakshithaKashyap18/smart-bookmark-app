'use client'

import { useEffect, useState } from 'react'
import { createClient } from './supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [addingBookmark, setAddingBookmark] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchBookmarks()
      const channel = setupRealtimeSubscription()
      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return channel
  }

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setBookmarks(data)
    }
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // FORCES Google to show the account selection screen every time
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // Hard reset of state and a refresh to clear internal cache
    setUser(null)
    setBookmarks([])
    window.location.href = '/'
  }

  const addBookmark = async (e) => {
    e.preventDefault()
    if (!url || !title || addingBookmark) return

    setAddingBookmark(true)

    const { error } = await supabase
      .from('bookmarks')
      .insert([{ 
        url: url.trim(), 
        title: title.trim(), 
        user_id: user.id 
      }])

    if (!error) {
      setUrl('')
      setTitle('')
    }

    setAddingBookmark(false)
  }

  const deleteBookmark = async (id) => {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bookmark Manager</h1>
            <p className="text-gray-600">Secure Google-only access to your links</p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C9.03,19.27 6.59,16.83 6.59,13.67C6.59,10.5 9.03,8.06 12.19,8.06C14.15,8.06 15.58,8.85 16.63,9.88L18.61,7.91C17.07,6.47 14.87,5.33 12.19,5.33C7.57,5.33 3.86,9.05 3.86,13.67C3.86,18.29 7.57,22 12.19,22C16.8,22 21.35,18.61 21.35,13.67C21.35,12.8 21.27,11.89 21.35,11.1Z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Bookmarks</h1>
              <p className="text-gray-600 mt-1">Logged in as: <span className="font-semibold">{user.email}</span></p>
            </div>
            <button
              onClick={signOut}
              className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition border border-red-100"
            >
              Switch Account / Sign Out
            </button>
          </div>
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Bookmark</h2>
          <form onSubmit={addBookmark} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Website Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={addingBookmark}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md disabled:bg-gray-400"
            >
              {addingBookmark ? 'Saving...' : 'Save Bookmark'}
            </button>
          </form>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No bookmarks saved yet.</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition group"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold text-lg block truncate"
                  >
                    {bookmark.title}
                  </a>
                  <p className="text-sm text-gray-500 truncate mt-1">{bookmark.url}</p>
                </div>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="opacity-0 group-hover:opacity-100 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition flex-shrink-0 font-medium"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}