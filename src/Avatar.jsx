import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  Avatar.propTypes = {
    url: PropTypes.any,
    size: PropTypes.any,
    onUpload: PropTypes.any
  }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="text-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image rounded-circle"
          style={{ height: '200px', width: '200px', border: "5px solid #3498db " }}
        />
      ) : (
        <div className="avatar no-image rounded-circle" style={{ height: size, width: size, backgroundColor: '#ddd' }} />
      )}
      <div style={{ width: size, marginLeft: "auto", marginRight: "auto" }} className="mt-3 text-center">
        <label className=" btn btn-outline-success" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
