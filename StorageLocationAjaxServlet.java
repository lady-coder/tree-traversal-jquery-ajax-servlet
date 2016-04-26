package mrc.anonymus.frontend.animal.tissue;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;











import mrc.anonymus.database.ReplicatedDatabase;
import mrc.anonymus.frontend.AbstractServlet;
import mrc.anonymus.frontend.facility.samplecontainer.AjaxReturnContainer;
import mrc.anonymus.model.AbstractTupleCache;
import mrc.anonymus.model.histology.TissueSample;
import mrc.anonymus.model.storage.SampleContainer;
import mrc.anonymus.model.storage.TissueSampleContainer;
import mrc.anonymus.util.DateUtils;
import mrc.anonymus.util.MessageHandler;

import com.google.gson.Gson;
/**
 * @author j.nicholas
 * 
 * <p>
 * Servlet to manage the storage container locations for FESA. 
 * This replaces the "Archive Browser" ExtJs drag-and-drop tool as the primary mechanism of positioning cryo-samples in containers 
 * <p>This servlet gives the asynchronous support for the jQuery ajax calls from fesa forms
 */
@SuppressWarnings("serial")
public class StorageLocationAjaxServlet extends AbstractServlet
{
    public void init(ServletConfig servletConfig) throws ServletException
    {
        super.init(servletConfig);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        Connection conn = null;
        String json = "";
        int sampleContainerId = 0;
        String action = "";
        long tissuesampleId;
        String existingSampleName ="";
        try
        {
            conn = ReplicatedDatabase.getConnection();
            HttpSession session = request.getSession();
            AbstractTupleCache cache = AbstractTupleCache.getInstance(session);
            if(request.getParameter("existing_sample")!=null)
                existingSampleName = request.getParameter("existing_sample");
            if(request.getParameter("action")!=null)
                action =request.getParameter("action");
            if(request.getParameter("sample_container_id")!=null)
                sampleContainerId =Integer.parseInt(request.getParameter("sample_container_id"));
            
          
            Random randomSession = new Random();
            if(action.equals("container"))
            {
                int jsonSessionId = randomSession.nextInt();
                System.out.println("session id==>"+jsonSessionId);
                //Replace this with your own database retrieval
                //Important -> Make sure to use the jsonSessionId as one of your object. Change sample.priorityId in js to your session object name 
                List<SampleContainer> sampleContainer =  SampleContainer.FACTORY.selectAll(cache, " WHERE parent_container_id ="+sampleContainerId+" AND invalid = 0 AND active = 1 ORDER BY position" , true);
            
                for(SampleContainer c : sampleContainer)
                {                     
                    TissueSample tissueSampleInLocation = getTissueSampleInLocation(c.getPrimaryKey(), conn, request);
                    
                    if(tissueSampleInLocation!=null)
                        c.setSampleName(tissueSampleInLocation.getSampleDisplayName());
                  //assign a unique response session to the ajax request..use priority_id column temporarily for this
                    c.setPriorityId(jsonSessionId);
                }          
                json = new Gson().toJson(sampleContainer);
            }
            else if (action.equals("save"))
            {
                boolean removeFromPreviousLocation = true;
                tissuesampleId = Long.parseLong(request.getParameter("tissueId").trim());
                TissueSample tissueSample = (TissueSample)TissueSample.FACTORY.select(cache, tissuesampleId);
                if(tissueSample.getSampleContainerDisplayString().equals("") || tissueSample.getSampleContainerDisplayString().length()==0 )
                    removeFromPreviousLocation = false;
                
                String newContainerLocation = moveTissueSample(sampleContainerId, tissuesampleId, removeFromPreviousLocation, existingSampleName,request, conn, cache);
                System.out.println("New location is "+newContainerLocation);
                json = new Gson().toJson(newContainerLocation);
            }
            else if (action.equals("autoFill"))
            {
                System.out.println("Start auto fill logic "+request.getParameter("tissueType")+"  "+request.getParameter("tissueSamples")) ;
                
            }
        
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        
          
        }

        
        catch(Exception e)
        {
            MessageHandler.logException(e, request);
        }
        finally
        {
            if (conn != null)
            {
                try
                {
                    conn.close();
                }
                catch (Exception e)
                {}

                conn = null;
             }
        }
    
    }
    
    public static String moveTissueSample(int sampleContainerId, long tissuesampleId, boolean removeFromPreviousLocation, String existingSampleName, HttpServletRequest request, Connection conn, AbstractTupleCache cache)
    {
        try
        {
            HttpSession session = request.getSession();
            long personLoggedOn = -1;
            try
            {
                personLoggedOn = mrc.anonymus.util.loginfo.CurrentLogin.getCurrentUserId(session);
            }
            catch (Exception e)
            {
                MessageHandler.logException(e, request);
                return "Failed";
            }
            
            if (removeFromPreviousLocation)
            {
                // remove from current location - if it has one!!!
                List<TissueSampleContainer> currentSampleLocationsForTissueSample = TissueSampleContainer.FACTORY.selectAll(cache, conn, " WHERE tissue_sample_id = " + tissuesampleId + " AND active=1 AND invalid=0", true);

                // Move the samples
                if (currentSampleLocationsForTissueSample.size() > 1)
                {
                    for(int i=0; i<currentSampleLocationsForTissueSample.size();i++)
                    {
                        TissueSampleContainer duplicateTissueSampleContainer =  currentSampleLocationsForTissueSample.get(i);
                        duplicateTissueSampleContainer.setActive(false);
                        duplicateTissueSampleContainer.setPerson(personLoggedOn);
                        duplicateTissueSampleContainer.commit();
                    }
                }
                else
                {
                    // Make the move...
                    TissueSampleContainer editTissueSampleContainer = (TissueSampleContainer) currentSampleLocationsForTissueSample.get(0);
                    editTissueSampleContainer.setActive(false);
                    editTissueSampleContainer.setPerson(personLoggedOn);
                    editTissueSampleContainer.commit();
                }
            }
            
            List<TissueSampleContainer> sampleInLocationTest = TissueSampleContainer.FACTORY.selectAll(cache, conn, " WHERE sample_container_id = " + sampleContainerId + " AND active=1 AND invalid=0", true);
           
            TissueSample updatedTissueLocation = (TissueSample) TissueSample.FACTORY.select(cache, conn, tissuesampleId);
            // are there any samples in the location we want? 
            if (sampleInLocationTest.size() > 0)
            {
                // sample location already has a sample in it! Can't do this!
                return "Failed - There is a Tissue Sample already in the location you are trying to place sample. That move, and any subsequent ones, has been cancelled.";
            }
            
            if(existingSampleName!=null && existingSampleName!="")
            {
                String newFesaCode = updatedTissueLocation.getIdTextElement();
                if(!existingSampleName.contains(newFesaCode))
                    return "Failed - FESA code doesn't match with existing samples. Cannot place this container in this location.";
            }
            // now - create a new location for the sample!
            TissueSampleContainer newTissueSampleContainer = (TissueSampleContainer) TissueSampleContainer.FACTORY.createInstance(cache);

            newTissueSampleContainer.setSampleContainer(sampleContainerId);
            newTissueSampleContainer.setTissueSample(tissuesampleId);
            newTissueSampleContainer.setDateStored(DateUtils.toSqlTimestamp(new Timestamp(System.currentTimeMillis())));
            newTissueSampleContainer.setActive(true);
            newTissueSampleContainer.setPerson(personLoggedOn);
            newTissueSampleContainer.commit();

            //TissueSample updatedTissueLocation = (TissueSample) TissueSample.FACTORY.select(cache, conn, tissuesampleId);

            return updatedTissueLocation.getSampleContainerDisplayString();   

        }
        catch (Exception e)
        {
            MessageHandler.logException(e, request);
            return "Failed";
        }
        finally
        {
            if (conn != null)
            {
                try
                {
                    conn.close();
                }
                catch (Exception e)
                {}

                conn = null;
            }
        }
    }
    
   
    public static TissueSample getTissueSampleInLocation(long locationNodeId, Connection conn, HttpServletRequest request)
    {
        TissueSample tsObject = null;

        try
        {
            HttpSession session = request.getSession();
            AbstractTupleCache cache = AbstractTupleCache.getInstance(session);

            String sql = " WHERE sample_container_id = " + String.valueOf(locationNodeId + " AND active = 1 AND invalid = 0");
            TissueSampleContainer tscObject = null;
            
            List<TissueSampleContainer> containerList = TissueSampleContainer.FACTORY.selectAll(cache, conn, sql, true);
            if (containerList.size() > 0)
            {
                tscObject = containerList.get(0);
                tsObject = tscObject.getTissueSample();
            }
            else
            {
                return null;
            }
        }
        catch (Exception e)
        {
            MessageHandler.logException(e, request);
            return null;
        }
        return tsObject;
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        doGet(request, response);
    }
    
    @Override
    public String getServletInfo()
    {
        return "Add/Edit/Choose storage container";
    }

}
