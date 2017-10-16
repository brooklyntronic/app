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
  baseUrl: Platform.OS === 'ios' ?  'http://localhost:3000/' : 'http://10.0.2.2:3000/',
preferences: [
{attr:'preferredSex', label: 'Preferred Sex', choices: ['Doesn\'t Matter','Male', 'Female']},
{attr:'preferredAge', label: 'Preferred Age', choices: [
'Doesn\'t Matter',
'18',
'19',
'20',
'21',
'22',
'23',
'24',
'25',
'26',
'27',
'28',
'29',
'30',
'31',
'32',
'33',
'34',
'35',
'36',
'37',
'38',
'39',
'40',
'41',
'42',
'43',
'44',
'45',
'46',
'47',
'48',
'49',
'50',
'51',
'52',
'53',
'54',
'55',
'56',
'57',
'58',
'59',
'60',
'61',
'62',
'63',
'64',
'65+'
]},
{attr:'preferredLocation', label: 'Preferred Location'},
{attr:'preferredRelationshipStatus', label: 'Preferred Relationship Status', choices: ['Single', 'Married', 'Complicated', 'In a Serious Relationship']},
{attr:'preferredNumberOfKids', label: 'Preferred Number of Kids', choices: ['0', '1','2','3','4','5','6','7','8','9','10', 'Over 10']},
{attr:'preferredBodyType', label: 'Preferred Body Type', choices: ['Slender','Athletic', 'Average','Husky/Voluptuous','Plus Size'],},
{attr:'preferredSmoker', label: 'Preferred Smoker', choices: ['Non Smoker', 'Occasional Smoker', 'Chain Smoker']},
{attr:'preferredDrinker', label: 'Preferred Drinker', choices: ['Non Drinker', 'Occasional Drinker', 'Heavy Drinker']},
{attr:'preferredUseLocation', label: 'Preferred Location'},
{attr:'preferredPhotos', label: 'Has Photos'}]

}