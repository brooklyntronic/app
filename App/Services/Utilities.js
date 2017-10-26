import { Platform } from 'react-native'
export default {
getAvatar: (match) => {
    if (match.facebook && !match.avatar){
      return 'https://graph.facebook.com/'+match.facebook.id+'/picture?type=large'
    }else if (match.twitter && !match.avatar){
      return  match.twitter.profile_image_url_https;
    }else if (match.instagram && !match.avatar){
      return  match.instagram.data.profile_picture;
    }else if (match.avatar){
      return  'https://d23grucy15vpbj.cloudfront.net/' + match.avatar;
    } else {
      return match.sex === 'female' ? 'https://d23grucy15vpbj.cloudfront.net/webImg/icons/user-female-icon.png' : 'https://d23grucy15vpbj.cloudfront.net/webImg/icons/user-male-icon.png';
    }
  },
  baseUrl: Platform.OS === 'ios' ?  'http://192.168.0.18:3000/' : 'http://10.0.2.2:3000/',
matchupCategories: ['Film & Animation',
'Cars & Vehicles',
'Music',
'Pets & Animals',
'Sports',
'Travel & Events',
'Gaming',
'People & Blogs',
'Comedy',
'Entertainment',
'News & Politics',
'How-to & Style',
'Education',
'Science & Technology',
'Non-profits & Activism']

}