import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Tag } from 'lucide-react';
import extractYouTubeEmbedUrl from '../utils/youtubeUrlUtils.jsx';

const EditShorts = ({ showNotification }) => {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [memo, setMemo] = useState('');
    const [embedUrl, setEmbedUrl] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
  
    useEffect(() => {
      fetchTags();
      fetchShort();
    }, [id]);
  
    const fetchTags = async () => {
      try {
        const response = await axios.get('/tags');
        setTags(response.data);
      } catch (error) {
        console.error('태그 불러오기 실패:', error);
      }
    };
  
const fetchShort = async () => {
  try {
    const response = await axios.get(`/shorts/${id}`);
    const { title, video_url, memo, tags: shortTags } = response.data;

    setTitle(title);
    setVideoUrl(video_url);
    setMemo(memo);
    setEmbedUrl(extractYouTubeEmbedUrl(video_url));

    // tags가 문자열일 경우 JSON 파싱, 아니면 ID 배열로 변환
    if (typeof shortTags === 'string') {
      const parsedTags = JSON.parse(shortTags); // 문자열인 경우 JSON 파싱
      setSelectedTags(parsedTags.map(tag => tag.id));
    } else if (Array.isArray(shortTags)) {
      setSelectedTags(shortTags.map(tag => tag.id)); // 이미 배열인 경우
    } else {
      console.warn('Invalid tags format:', shortTags);
      setSelectedTags([]); // 포맷이 이상할 경우 빈 배열로 설정
    }
  } catch (error) {
    console.error('쇼츠 불러오기 실패:', error);
  }
};

  
    const handleUrlChange = (url) => {
      setVideoUrl(url);
      const embed = extractYouTubeEmbedUrl(url);
      setEmbedUrl(embed);
    };
  
    const toggleTag = (tagId) => {
      setSelectedTags(prev => 
        prev.includes(tagId) 
          ? prev.filter(id => id !== tagId) 
          : [...prev, tagId]
      );
    }
      const handleSubmit = async (e) => {
        e.preventDefault();

        // 필드 유효성 확인
        if (!title.trim()) {
          showNotification('제목을 입력해주세요.', 'error');
          return;
        }
        if (!videoUrl.trim()) {
          showNotification('Youtube Shorts URL을 입력해주세요.', 'error');
          return;
        }
        if (!memo.trim()) {
          showNotification('메모를 입력해주세요.', 'error');
          return;
        }
        if (selectedTags.length === 0) {
          showNotification('최소 하나의 태그를 선택해주세요.', 'error');
          return;
        }

        try {
          await axios.put(`/shorts/${id}`, {
            title, 
            videoUrl, 
            memo,
            tags: selectedTags
          });
          
          showNotification('쇼츠가 성공적으로 수정되었습니다!');
          
          // 1초 후 메인 페이지로 이동
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } catch (error) {
          console.error('쇼츠 수정 실패:', error);
          showNotification('쇼츠 수정에 실패했습니다.', 'error');
        }
      };
    
      return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">수정하기</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="제목" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required 
            />
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Shorts URL" 
                value={videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required 
              />
              {embedUrl && (
                <div className="aspect-video">
                  <iframe 
                    src={embedUrl} 
                    title="YouTube video preview"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            <textarea 
              placeholder="메모" 
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full p-3 border rounded-lg h-32"
            />
            <div className="mb-4">
              <label className="block mb-2 font-semibold">태그 선택</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center
                      ${selectedTags.includes(tag.id) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700'}`}
                  >
                    <Tag className="mr-1 w-4 h-4" /> {tag.name}
                  </button>
                ))}
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              수정 완료
            </button>
          </form>
        </div>
      );
    };
export default EditShorts;