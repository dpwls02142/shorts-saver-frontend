import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, Search, Tag } from 'lucide-react';
import extractYouTubeEmbedUrl from '../utils/youtubeUrlUtils.jsx';

const ShortsList = () => {
  const [shorts, setShorts] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchShorts();
    fetchTags();
  }, []);

  const fetchShorts = async () => {
    try {
      const response = await axios.get('/shorts');
      setShorts(response.data);
    } catch (error) {
      console.error('쇼츠 불러오기 실패:', error);
    } finally {
      setLoading(false); // Stop loading when fetch is complete
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('태그 불러오기 실패:', error);
    }
  };

  const deleteShorts = async (id) => {
    try {
      await axios.delete(`/shorts/${id}`);
      fetchShorts();
    } catch (error) {
      console.error('쇼츠 삭제 실패:', error);
    }
  };

  const toggleTagFilter = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const filteredShorts = shorts.filter((short) => {
    return (
      // 검색어 필터링
      (searchTerm === '' || short.title.includes(searchTerm) || short.memo.includes(searchTerm)) &&
      // 태그 필터링
      (selectedTags.length === 0 || short.tags.some(tag => selectedTags.includes(tag.id)))
    );
  });
  

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <div className="mb-6 flex items-center">
        <div className="relative flex-grow mr-4">
          <input 
            type="text" 
            placeholder="검색하기..." 
            className="w-full p-3 pl-10 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTagFilter(tag.id)}
            className={`px-3 py-1 rounded-full text-sm flex items-center
              ${selectedTags.includes(tag.id) 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'}`}
          >
            <Tag className="mr-1 w-4 h-4" /> {tag.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShorts.map((short) => {
          const embedUrl = extractYouTubeEmbedUrl(short.video_url);
          
          return (
            <div 
              key={short.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
            {embedUrl ? (
                <div className="mb-4 aspect-video">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="mb-4 bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-gray-500">쇼츠 영상으로 추가해주세요</p>
                </div>
            )}
              <h2 className="text-xl font-bold mb-2">{short.title}</h2>
              <p className="text-gray-600 mb-4">{short.memo}</p>
              
             <div className="mb-4 flex flex-wrap gap-2">
              {(Array.isArray(short.tags) ? short.tags : []).map((tag) => (
                <span 
                  key={tag.id} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center"
                >
                  <Tag className="mr-1 w-3 h-3" /> {tag.name}
                </span>
              ))}
            </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate(`/edit/${short.id}`)}
                  className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                >
                  <Edit className="mr-2" /> 수정
                </button>
                <button 
                  onClick={() => deleteShorts(short.id)}
                  className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  <Trash2 className="mr-2" /> 삭제
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShortsList;