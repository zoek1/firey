# Firey - The message board

## What is Firey?

It's a message board that allows people to join based on participation in the FOAM . The participation measure will in consideration are the number of FOAM tokens, POIs and Challenges. This project applies a reputation layer to enable a manageable community message board and improve participation through gamification.

Firey is based on the idea of Minimal Viable Participation or MVP. This means that each thread will be created with a set of rules that decide whats the minimum elements to participate in the thread. One important thing to note is every thread will be located over one POI plus a given bounding box to create the area of participation, this means that **you need have been participated in this area at list one time plus the requirements of tokens, POIs and challenges.** 

So in simple terms the MVP for each thread wil be composed by *Location + amount of participation*. Let's give one example:
Suppose that you want start a mapathon in the pier 15 of Santa monica, so you need to set the bounfing box to cover the area of to be a succesful mapathon you need to expand the area to  goal we require to cover the santa Monica area at least. Also each participant will have an amount to 50 FOAM to create at least one POI. So the  MVP for you thread will be the following:

**Location**: 19.0476454, -98.0574308
**Area**: Level 6 to cover Santa Monica
**Paticipation**: 50 FOAM token

Now you're ready to invite people, plan and organize the event all from  the same thread.

## Management thorugh the time

What happens if you need a combination of POIs, Tokens y challenges or what if i don't know what will be a good measure to invite people to participate in the thread. Thats why we decided include badges where each badge could be composed by any participation element, to enahce the gamification expirence each member will have a board to visualize how is progressing and how specialize to give more value to the community.  Also thanks to this we could see how progress the zones and how strong is the community so in the future could be created contents or collaboration between communities. 

![](https://www.freecodecamp.org/news/content/images/2019/10/image-3.png)
(Tree skills example)[http://borderlands-skill-tree.s3-website.eu-west-2.amazonaws.com/]

The first level of the tree badged will be proposed by the foam members project, this will be the minimal level of participation (1 point, 1 Challenge, 50 FOAM). After that the community will request for badges prividing its participation and the argumentation and the area of specialization. Every month new badge will be issued, being this the most voted badge from the community.

Agrupation based on badges will enable easy management of community and improve participation due the gamification approach of challenges to upgrade his/her level. 


### Moderation
Two approaches 

## Platform thinking in this scenarios:

1. **Collaboration**: Create a thread, write the context in the description, set the area in which you're interested growing the participation and invite mappers to collaborate.

2. **Organization & Planning**: Do you want to organize a mapathon in a given area, create a thread and talk with experienced members about what is needed. Use the map tab to explore the area.

3. **Discussion**: Do you want to challenge some points? great! Create a thread to communicate why you disagree with the current POI.

4. **Informative**: Publish history, fun facts or other data related to some region. This also could help to improve the FOAM map to enhance the location info.


## Implemented elements 


- [X] Message board (essentially an alternative to Discourse) that allows people to join based on reputation 
- [X] The participation measure might be sorted by number of FOAM tokens or amount of FOAM map activity. 
- [X] Strategically apply reputation layer(s) to enable a manageable community message board
- [X] Threads could be organized by region and require users to have added cartographic data to FOAM in that region to post. Comment based on foam participation (poi, challenges, foam token, location)
- [X] Utilize 3Box (Ethereum profiles) and the 3Box chat tools.



## Road to production



## Flow
### Search for a thread to join
![screenshots](/screenshots/threads.png)
## Or create a new one and give some challenge to the people to join
![screenshots](/screenshots/new_thread.png)
## Visualize the post and comments
![screenshots](/screenshots/thread_detail.png)
## Interaction in context with maps.
![screenshots](/screenshots/comments.png)
