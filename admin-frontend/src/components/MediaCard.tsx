import React from 'react'
import type { Complaint } from '../types/complaint'

interface Props {
    data : Complaint
}

const MediaCard:React.FC<Props> = ({data}) => {
    return (
        <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Attached Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data?.media.map((media, index) => (
                    <div key={media.media_id}>
                        {
                            media.file_type === 'image' &&
                            <img
                                key={index}
                                alt={`Pothole Image ${index + 1}`}
                                className="rounded-lg object-cover w-full h-32 cursor-pointer hover:opacity-80 transition-opacity"
                                src={media.file_url}
                            />
                        }

                        {
                            media.file_type === 'video' &&
                            <video
                                key={index}
                                src={media.file_url}
                            />
                        }

                    </div>


                ))}
            </div>
        </div>
    )
}

export default MediaCard